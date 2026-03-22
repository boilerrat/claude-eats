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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Shopping List</h1>
          {plan && (
            <p className="text-gray-400 text-sm mt-0.5">{formatWeekRange(weekStart)}</p>
          )}
        </div>
        {plan && (
          <a
            href="/api/export/shopping?format=docx"
            className="px-3 py-1.5 rounded border border-gray-700 text-sm text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
          >
            Export DOCX
          </a>
        )}
      </div>

      {!plan || grouped.length === 0 ? (
        <p className="text-gray-500">No shopping list yet — generate a meal plan first.</p>
      ) : (
        <ShoppingListView planId={plan.id} grouped={grouped} />
      )}
    </div>
  );
}
