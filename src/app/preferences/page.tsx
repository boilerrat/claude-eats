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
      <h1 className="font-display italic text-3xl sm:text-4xl text-text leading-tight mb-2">
        Preferences
      </h1>
      <p className="text-muted text-sm mb-8">
        Claude uses these every time it generates a meal plan.
      </p>
      <PreferencesView blocked={blocked} preferred={preferred} />
    </div>
  );
}
