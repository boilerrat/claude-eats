import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { id, checked } = await req.json();
  if (typeof id !== 'string' || typeof checked !== 'boolean') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
  await prisma.shoppingListItem.update({ where: { id }, data: { checked } });
  return NextResponse.json({ ok: true });
}
