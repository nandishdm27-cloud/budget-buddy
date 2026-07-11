"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type BudgetData,
  type Category,
  type Goal,
  type Transaction,
  DEFAULT_CATEGORIES,
  DEFAULT_GOALS,
  STORAGE_KEY,
} from "@/components/budget/types";

const CURRENT_VERSION = 1;

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
    if (parsed.version !== CURRENT_VERSION) return getDefaultData();
    return {
      ...getDefaultData(),
      ...parsed,
      categories: parsed.categories?.length ? parsed.categories : DEFAULT_CATEGORIES,
      goals: parsed.goals?.length ? parsed.goals : DEFAULT_GOALS,
    };
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

  const income = data.transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = data.transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBudget = data.categories.reduce((sum, c) => sum + c.budget, 0);

  const categorySpending = data.categories.map((category) => ({
    ...category,
    spent: data.transactions
      .filter((t) => t.type === "expense" && t.categoryId === category.id)
      .reduce((sum, t) => sum + t.amount, 0),
  }));

  return {
    data,
    hydrated,
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
