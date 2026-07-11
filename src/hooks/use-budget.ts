"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type BudgetData,
  type BudgetPeriod,
  type Category,
  type Goal,
  type Transaction,
  DEFAULT_CATEGORIES,
  DEFAULT_GOALS,
  STORAGE_KEY,
  getPeriodBudget,
} from "@/components/budget/types";

const CURRENT_VERSION = 2;

function getDefaultData(): BudgetData {
  return {
    version: CURRENT_VERSION,
    period: "monthly",
    transactions: [],
    categories: DEFAULT_CATEGORIES,
    goals: DEFAULT_GOALS,
  };
}

function loadData(): BudgetData {
  if (typeof window === "undefined") return getDefaultData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    const parsed = JSON.parse(raw) as BudgetData;
    const base = {
      ...getDefaultData(),
      ...parsed,
      categories: parsed.categories?.length ? parsed.categories : DEFAULT_CATEGORIES,
      goals: parsed.goals?.length ? parsed.goals : DEFAULT_GOALS,
    };
    // Ensure period exists for older saved data
    if (!base.period) base.period = "monthly";
    return base;
  } catch {
    return getDefaultData();
  }
}

function saveData(data: BudgetData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useBudget() {
  const [data, setData] = useState<BudgetData>(getDefaultData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(loadData());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveData(data);
  }, [data, hydrated]);

  const setPeriod = useCallback((period: BudgetPeriod) => {
    setData((prev) => ({ ...prev, period }));
  }, []);

  const addTransaction = useCallback((transaction: Omit<Transaction, "id">) => {
    setData((prev) => ({
      ...prev,
      transactions: [
        { ...transaction, id: crypto.randomUUID() },
        ...prev.transactions,
      ],
    }));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  }, []);

  const addCategory = useCallback((category: Omit<Category, "id">) => {
    setData((prev) => ({
      ...prev,
      categories: [...prev.categories, { ...category, id: crypto.randomUUID() }],
    }));
  }, []);

  const updateCategoryBudget = useCallback((id: string, budget: number) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === id ? { ...c, budget } : c)),
    }));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id),
      transactions: prev.transactions.filter((t) => t.categoryId !== id),
    }));
  }, []);

  const addGoal = useCallback((goal: Omit<Goal, "id">) => {
    setData((prev) => ({
      ...prev,
      goals: [...prev.goals, { ...goal, id: crypto.randomUUID() }],
    }));
  }, []);

  const updateGoalSaved = useCallback((id: string, saved: number) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === id ? { ...g, saved } : g)),
    }));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id),
    }));
  }, []);

  const resetData = useCallback(() => {
    setData(getDefaultData());
  }, []);

  const { period } = data;

  const income = data.transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = data.transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBudget = useMemo(
    () => data.categories.reduce((sum, c) => sum + getPeriodBudget(c.budget, period), 0),
    [data.categories, period]
  );

  const categorySpending = useMemo(
    () =>
      data.categories.map((category) => ({
        ...category,
        budget: getPeriodBudget(category.budget, period),
        spent: data.transactions
          .filter((t) => t.type === "expense" && t.categoryId === category.id)
          .reduce((sum, t) => sum + t.amount, 0),
      })),
    [data.categories, data.transactions, period]
  );

  return {
    data,
    hydrated,
    period,
    setPeriod,
    income,
    expenses,
    balance: income - expenses,
    totalBudget,
    categorySpending,
    addTransaction,
    deleteTransaction,
    addCategory,
    updateCategoryBudget,
    deleteCategory,
    addGoal,
    updateGoalSaved,
    deleteGoal,
    resetData,
  };
}
