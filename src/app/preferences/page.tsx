import { prisma } from '@/lib/db';
import PreferencesView from '@/components/PreferencesView';

export const dynamic = 'force-dynamic';

export default async function PreferencesPage() {
  const prefs = await prisma.ingredientPreference.findMany({
    orderBy: { createdAt: 'asc' },
  });

  const blocked = prefs.filter(p => p.type === 'blocked');
  const preferred = prefs.filter(p => p.type === 'preferred');

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-2">Ingredient Preferences</h1>
      <p className="text-gray-400 text-sm mb-8">
        These are sent to the AI every time a meal plan is generated.
      </p>
      <PreferencesView blocked={blocked} preferred={preferred} />
    </div>
  );
}
