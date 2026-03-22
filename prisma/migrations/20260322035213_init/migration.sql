-- CreateTable
CREATE TABLE "Meal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "recipe" TEXT NOT NULL,
    "prepGuide" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "MealRating" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mealId" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MealRating_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IngredientPreference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ingredient" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "WeeklyPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekStart" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "WeeklyPlanMeal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "servings" INTEGER NOT NULL DEFAULT 6,
    CONSTRAINT "WeeklyPlanMeal_planId_fkey" FOREIGN KEY ("planId") REFERENCES "WeeklyPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WeeklyPlanMeal_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ShoppingListItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "checked" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    CONSTRAINT "ShoppingListItem_planId_fkey" FOREIGN KEY ("planId") REFERENCES "WeeklyPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "IngredientPreference_ingredient_key" ON "IngredientPreference"("ingredient");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyPlan_weekStart_key" ON "WeeklyPlan"("weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyPlanMeal_planId_dayOfWeek_key" ON "WeeklyPlanMeal"("planId", "dayOfWeek");
