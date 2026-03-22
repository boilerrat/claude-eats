import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentWeekStart, formatWeekRange } from '@/lib/dates';
import type { PrepGuideJSON } from '@/lib/types';
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
} from 'docx';

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export async function GET() {
  const weekStart = getCurrentWeekStart();
  const plan = await prisma.weeklyPlan.findUnique({
    where: { weekStart },
    include: { meals: { include: { meal: true } } },
  });

  if (!plan) {
    return NextResponse.json({ error: 'No plan for this week' }, { status: 404 });
  }

  const sortedMeals = [...plan.meals].sort(
    (a, b) => DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek)
  );

  const children: Paragraph[] = [
    new Paragraph({
      text: `Sunday Prep Guide — ${formatWeekRange(weekStart)}`,
      heading: HeadingLevel.HEADING_1,
    }),
  ];

  for (let i = 0; i < sortedMeals.length; i++) {
    const { meal, dayOfWeek } = sortedMeals[i];
    const prep: PrepGuideJSON = JSON.parse(meal.prepGuide);

    children.push(
      new Paragraph({ text: '', spacing: { before: 300 } }),
      new Paragraph({
        text: `${i + 1}. ${dayOfWeek} — ${meal.name}`,
        heading: HeadingLevel.HEADING_2,
      }),
    );

    for (const step of prep.steps) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: '•  ' }),
            new TextRun({ text: step }),
          ],
          spacing: { before: 100 },
        }),
      );
    }

    if (prep.vacuumTips.length > 0) {
      children.push(
        new Paragraph({ text: 'Vacuum Sealer', spacing: { before: 200 }, style: 'Strong' }),
      );
      for (const tip of prep.vacuumTips) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'VS  ', bold: true, color: '2563EB' }),
              new TextRun({ text: tip }),
            ],
            spacing: { before: 100 },
          }),
        );
      }
    }
  }

  const doc = new Document({ sections: [{ children }] });
  const buffer = await Packer.toBuffer(doc);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename="sunday-prep.docx"',
    },
  });
}
