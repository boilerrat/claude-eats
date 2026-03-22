import { prisma } from '@/lib/db';
import { getAppSettings } from '@/lib/appSettings';
import SettingsView from '@/components/SettingsView';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const [settings, prefs] = await Promise.all([
    getAppSettings(),
    prisma.ingredientPreference.findMany({ orderBy: { createdAt: 'asc' } }),
  ]);

  const planDays: string[] = JSON.parse(settings.planDays);
  const blocked = prefs.filter(p => p.type === 'blocked');
  const preferred = prefs.filter(p => p.type === 'preferred');

  return (
    <div className="max-w-xl">
      <h1 className="font-display italic text-3xl sm:text-4xl text-text leading-tight mb-2">
        Settings
      </h1>
      <p className="text-muted text-sm mb-8">
        Manage your meal preferences, planning days, API key, and password.
      </p>
      <SettingsView
        planDays={planDays}
        apiKeySet={settings.anthropicApiKey.length > 0}
        blocked={blocked}
        preferred={preferred}
      />
    </div>
  );
}
