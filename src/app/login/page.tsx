import { redirect } from 'next/navigation';
import { getAppSettings } from '@/lib/appSettings';
import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const settings = await getAppSettings();
  if (!settings.passwordHash) {
    redirect('/setup');
  }
  return <LoginForm />;
}
