-- CreateTable
CREATE TABLE "AppSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "passwordHash" TEXT NOT NULL DEFAULT '',
    "anthropicApiKey" TEXT NOT NULL DEFAULT '',
    "planDays" TEXT NOT NULL DEFAULT '["Monday","Tuesday","Wednesday","Thursday","Friday"]'
);
