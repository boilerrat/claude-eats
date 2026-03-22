-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WeeklyPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekStart" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "skippedDays" TEXT NOT NULL DEFAULT '[]'
);
INSERT INTO "new_WeeklyPlan" ("createdAt", "id", "weekStart") SELECT "createdAt", "id", "weekStart" FROM "WeeklyPlan";
DROP TABLE "WeeklyPlan";
ALTER TABLE "new_WeeklyPlan" RENAME TO "WeeklyPlan";
CREATE UNIQUE INDEX "WeeklyPlan_weekStart_key" ON "WeeklyPlan"("weekStart");
CREATE TABLE "new_WeeklyPlanMeal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "servings" INTEGER NOT NULL DEFAULT 6,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "WeeklyPlanMeal_planId_fkey" FOREIGN KEY ("planId") REFERENCES "WeeklyPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WeeklyPlanMeal_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WeeklyPlanMeal" ("dayOfWeek", "id", "mealId", "planId", "servings") SELECT "dayOfWeek", "id", "mealId", "planId", "servings" FROM "WeeklyPlanMeal";
DROP TABLE "WeeklyPlanMeal";
ALTER TABLE "new_WeeklyPlanMeal" RENAME TO "WeeklyPlanMeal";
CREATE UNIQUE INDEX "WeeklyPlanMeal_planId_dayOfWeek_key" ON "WeeklyPlanMeal"("planId", "dayOfWeek");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
