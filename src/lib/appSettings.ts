import { prisma } from './db';

export async function getAppSettings() {
  return prisma.appSettings.upsert({
    where: { id: 'singleton' },
    create: { id: 'singleton' },
    update: {},
  });
}

export async function updateAppSettings(data: Partial<{
  passwordHash: string;
  anthropicApiKey: string;
  planDays: string;
}>) {
  return prisma.appSettings.upsert({
    where: { id: 'singleton' },
    create: { id: 'singleton', ...data },
    update: data,
  });
}

export async function getPlanDays(): Promise<string[]> {
  const settings = await getAppSettings();
  try {
    return JSON.parse(settings.planDays) as string[];
  } catch {
    return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  }
}
