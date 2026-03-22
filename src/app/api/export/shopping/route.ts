import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentWeekStart, formatWeekRange } from '@/lib/dates';
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
} from 'docx';

const CATEGORY_ORDER = ['proteins', 'produce', 'dairy', 'pantry', 'spices'];
const CATEGORY_LABELS: Record<string, string> = {
  proteins: 'Proteins',
  produce: 'Produce',
  dairy: 'Dairy & Eggs',
  pantry: 'Pantry',
  spices: 'Spices & Condiments',
};

export async function GET() {
  const weekStart = getCurrentWeekStart();
  const plan = await prisma.weeklyPlan.findUnique({
    where: { weekStart },
    include: { shoppingItems: { orderBy: { item: 'asc' } } },
  });

  if (!plan) {
    return NextResponse.json({ error: 'No plan for this week' }, { status: 404 });
  }

  const children: Paragraph[] = [
    new Paragraph({
      text: `Shopping List — ${formatWeekRange(weekStart)}`,
      heading: HeadingLevel.HEADING_1,
    }),
  ];

  for (const cat of CATEGORY_ORDER) {
    const items = plan.shoppingItems.filter(i => i.category === cat);
    if (items.length === 0) continue;

    children.push(
      new Paragraph({ text: '', spacing: { before: 200 } }),
      new Paragraph({
        text: CATEGORY_LABELS[cat] ?? cat,
        heading: HeadingLevel.HEADING_2,
      }),
    );

    for (const item of items) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: '☐  ', font: 'Arial' }),
            new TextRun({ text: `${item.amount} ${item.unit}  ` }),
            new TextRun({ text: item.item, bold: true }),
            ...(item.note ? [new TextRun({ text: `  (${item.note})`, color: '888888' })] : []),
          ],
        }),
      );
    }
  }

  const doc = new Document({ sections: [{ children }] });
  const buffer = await Packer.toBuffer(doc);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename="shopping-list.docx"',
    },
  });
}
