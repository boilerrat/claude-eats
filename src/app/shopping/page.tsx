import { prisma } from '@/lib/db';
import { getCurrentWeekStart, formatWeekRange } from '@/lib/dates';
import ShoppingListView from '@/components/ShoppingListView';

export const dynamic = 'force-dynamic';

const CATEGORY_ORDER = ['proteins', 'produce', 'dairy', 'pantry', 'spices'];
const CATEGORY_LABELS: Record<string, string> = {
  proteins: 'Proteins',
  produce: 'Produce',
  dairy: 'Dairy & Eggs',
  pantry: 'Pantry',
  spices: 'Spices & Condiments',
};

export default async function ShoppingPage() {
  const weekStart = getCurrentWeekStart();
  const plan = await prisma.weeklyPlan.findUnique({
    where: { weekStart },
    include: { shoppingItems: { orderBy: { item: 'asc' } } },
  });

  const grouped = CATEGORY_ORDER.map(cat => ({
    category: cat,
    label: CATEGORY_LABELS[cat] ?? cat,
    items: plan?.shoppingItems.filter(i => i.category === cat) ?? [],
  })).filter(g => g.items.length > 0);

  return (
    <div className="max-w-2xl">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display italic text-3xl sm:text-4xl text-text leading-tight">
            Shopping List
          </h1>
          {plan && (
            <p className="text-muted text-sm mt-1.5 font-medium">{formatWeekRange(weekStart)}</p>
          )}
        </div>
        {plan && (
          <a
            href="/api/export/shopping?format=docx"
            className="shrink-0 mt-1 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-sm text-muted hover:text-text hover:border-border-bright transition-all"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <path d="M8 2v8M5 7l3 3 3-3M3 13h10"/>
            </svg>
            Export
          </a>
        )}
      </div>

      {!plan || grouped.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display italic text-xl text-muted mb-2">No list yet</p>
          <p className="text-subtle text-sm">Generate a meal plan first to build your shopping list.</p>
        </div>
      ) : (
        <ShoppingListView planId={plan.id} grouped={grouped} />
      )}
    </div>
  );
}
