import { redirect } from 'next/navigation';
import { getAppSettings } from '@/lib/appSettings';
import SetupForm from './SetupForm';

export const dynamic = 'force-dynamic';

export default async function SetupPage() {
  const settings = await getAppSettings();
  if (settings.passwordHash) {
    redirect('/login');
  }
  return <SetupForm />;
}
