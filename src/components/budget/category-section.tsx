import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { getIcon } from "./icon-map";
import { formatCurrency, cn } from "@/lib/utils";
import type { Category } from "./types";
import { Plus, Trash2 } from "lucide-react";

interface CategoryWithSpending extends Category {
  spent: number;
}

interface CategorySectionProps {
  categories: CategoryWithSpending[];
  totalBudget: number;
  onAddCategory: () => void;
  onDeleteCategory: (id: string) => void;
}

export function CategorySection({
  categories,
  totalBudget,
  onAddCategory,
  onDeleteCategory,
}: CategorySectionProps) {
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
  const overallProgress = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="font-heading text-xl">Budget Categories</CardTitle>
          <CardDescription>
            {formatCurrency(totalSpent)} of {formatCurrency(totalBudget)} spent
          </CardDescription>
        </div>
        <Button size="sm" onClick={onAddCategory} className="shrink-0 gradient-hero text-white border-0">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall budget used</span>
            <span className="font-medium text-foreground">{overallProgress.toFixed(0)}%</span>
          </div>
          <Progress value={overallProgress} className="h-3 bg-muted" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((category) => {
            const Icon = getIcon(category.icon);
            const percent = category.budget > 0 ? Math.min((category.spent / category.budget) * 100, 100) : 0;
            const overBudget = category.spent > category.budget;
            return (
              <div
                key={category.id}
                className="group relative rounded-xl border border-border bg-background/50 p-4 transition-colors hover:bg-background"
              >
                <button
                  onClick={() => onDeleteCategory(category.id)}
                  className="absolute right-3 top-3 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  aria-label={`Delete ${category.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", category.color)}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{category.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(category.spent)} / {formatCurrency(category.budget)}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <Progress
                    value={percent}
                    className={cn("h-2 bg-muted", overBudget && "[&>div]:bg-destructive")}
                  />
                  {overBudget && (
                    <p className="mt-1 text-xs text-destructive">
                      Over by {formatCurrency(category.spent - category.budget)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
