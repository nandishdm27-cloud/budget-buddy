import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useBudget } from "@/hooks/use-budget";
import { SummaryCards } from "@/components/budget/summary-cards";
import { CategorySection } from "@/components/budget/category-section";
import { TransactionSection } from "@/components/budget/transaction-section";
import { GoalSection } from "@/components/budget/goal-section";
import { ChartSection } from "@/components/budget/chart-section";
import { AddTransactionDialog } from "@/components/budget/add-transaction-dialog";
import { AddCategoryDialog } from "@/components/budget/add-category-dialog";
import { AddGoalDialog } from "@/components/budget/add-goal-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Student Budget — Monthly Money Tracker" },
      { name: "description", content: "Track income, expenses, budgets, and savings goals built for students." },
      { property: "og:title", content: "Student Budget — Monthly Money Tracker" },
      { property: "og:description", content: "Track income, expenses, budgets, and savings goals built for students." },
    ],
  }),
  component: Index,
});

function Index() {
  const {
    data,
    hydrated,
    income,
    expenses,
    balance,
    categorySpending,
    addTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
    addGoal,
    updateGoalSaved,
    deleteGoal,
    resetData,
  } = useBudget();

  const [transactionOpen, setTransactionOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);

  const totalSaved = data.goals.reduce((sum, g) => sum + g.saved, 0);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-hero glow-indigo">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
                Student <span className="text-gradient">Budget</span>
              </h1>
              <p className="text-sm text-muted-foreground">Track every dollar. Save for what matters.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm("Reset all budget data to defaults?")) resetData();
              }}
              className="border-border text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={() => setTransactionOpen(true)}
              className="gradient-hero text-white border-0"
            >
              Add Transaction
            </Button>
          </div>
        </header>

        <SummaryCards income={income} expenses={expenses} balance={balance} totalSaved={totalSaved} />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <CategorySection
              categories={categorySpending}
              totalBudget={categorySpending.reduce((sum, c) => sum + c.budget, 0)}
              onAddCategory={() => setCategoryOpen(true)}
              onDeleteCategory={deleteCategory}
            />
            <TransactionSection
              transactions={data.transactions}
              categories={data.categories}
              onAddTransaction={() => setTransactionOpen(true)}
              onDeleteTransaction={deleteTransaction}
            />
          </div>
          <div className="space-y-8">
            <ChartSection categories={categorySpending} />
            <GoalSection
              goals={data.goals}
              onAddGoal={() => setGoalOpen(true)}
              onUpdateSaved={updateGoalSaved}
              onDeleteGoal={deleteGoal}
            />
          </div>
        </div>

        <footer className="pt-8 text-center text-sm text-muted-foreground">
          <p>Your data is stored locally in this browser.</p>
        </footer>
      </div>

      <AddTransactionDialog
        open={transactionOpen}
        onOpenChange={setTransactionOpen}
        categories={data.categories}
        onAdd={addTransaction}
      />
      <AddCategoryDialog open={categoryOpen} onOpenChange={setCategoryOpen} onAdd={addCategory} />
      <AddGoalDialog open={goalOpen} onOpenChange={setGoalOpen} onAdd={addGoal} />
    </div>
  );
}
