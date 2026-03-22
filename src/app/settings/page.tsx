import { getAppSettings } from '@/lib/appSettings';
import SettingsView from '@/components/SettingsView';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const settings = await getAppSettings();
  const planDays: string[] = JSON.parse(settings.planDays);

  return (
    <div className="max-w-xl">
      <h1 className="font-display italic text-3xl sm:text-4xl text-text leading-tight mb-2">
        Settings
      </h1>
      <p className="text-muted text-sm mb-8">
        Manage your API key, planning days, and password.
      </p>
      <SettingsView
        planDays={planDays}
        apiKeySet={settings.anthropicApiKey.length > 0}
      />
    </div>
  );
}
