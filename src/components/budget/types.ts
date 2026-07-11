export type TransactionType = "income" | "expense";

export type BudgetPeriod = "monthly" | "weekly";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  description: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  budget: number; // stored as monthly
  color: AccentColor;
  icon: string;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  color: AccentColor;
}

export type AccentColor = "indigo" | "rose" | "amber" | "cyan" | "lime";

export interface BudgetData {
  version: number;
  period: BudgetPeriod;
  transactions: Transaction[];
  categories: Category[];
  goals: Goal[];
}

export const WEEKS_PER_MONTH = 4.333333;

export function getPeriodBudget(monthlyBudget: number, period: BudgetPeriod): number {
  if (period === "weekly") return monthlyBudget / WEEKS_PER_MONTH;
  return monthlyBudget;
}

export function toMonthlyBudget(periodBudget: number, period: BudgetPeriod): number {
  if (period === "weekly") return periodBudget * WEEKS_PER_MONTH;
  return periodBudget;
}

export function getPeriodLabel(period: BudgetPeriod): string {
  return period === "weekly" ? "week" : "month";
}

export function getPeriodTitle(period: BudgetPeriod): string {
  return period === "weekly" ? "Weekly" : "Monthly";
}

export const ACCENT_COLORS: { value: AccentColor; label: string; class: string }[] = [
  { value: "indigo", label: "Indigo", class: "bg-accent-indigo" },
  { value: "rose", label: "Rose", class: "bg-accent-rose" },
  { value: "amber", label: "Amber", class: "bg-accent-amber" },
  { value: "cyan", label: "Cyan", class: "bg-accent-cyan" },
  { value: "lime", label: "Lime", class: "bg-accent-lime" },
];

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "food", name: "Food & Groceries", budget: 300, color: "indigo", icon: "utensils" },
  { id: "transport", name: "Transport", budget: 100, color: "cyan", icon: "bus" },
  { id: "travel", name: "Travel", budget: 150, color: "rose", icon: "plane" },
  { id: "entertainment", name: "Entertainment", budget: 100, color: "amber", icon: "gamepad-2" },
  { id: "rent", name: "Rent & Housing", budget: 600, color: "lime", icon: "home" },
  { id: "books", name: "Books & Supplies", budget: 80, color: "indigo", icon: "book-open" },
  { id: "utilities", name: "Utilities & Bills", budget: 80, color: "cyan", icon: "zap" },
  { id: "shopping", name: "Shopping", budget: 100, color: "rose", icon: "shopping-bag" },
  { id: "health", name: "Health", budget: 50, color: "amber", icon: "heart-pulse" },
  { id: "projects", name: "Projects & Hardware", budget: 60, color: "lime", icon: "cpu" },
  { id: "software", name: "Software & Tools", budget: 40, color: "indigo", icon: "code-2" },
  { id: "coffee", name: "Coffee & Study Fuel", budget: 50, color: "cyan", icon: "coffee" },
  { id: "other", name: "Other", budget: 50, color: "lime", icon: "more-horizontal" },
];

export const DEFAULT_GOALS: Goal[] = [
  { id: "emergency", name: "Emergency Fund", target: 1000, saved: 0, color: "indigo" },
  { id: "laptop", name: "New Laptop / Gear", target: 1200, saved: 0, color: "cyan" },
  { id: "trip", name: "Spring Break Trip", target: 800, saved: 0, color: "rose" },
];

export const STORAGE_KEY = "student-budget-data";
