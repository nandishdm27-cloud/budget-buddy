import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getIcon } from "./icon-map";
import { formatCurrency, cn } from "@/lib/utils";
import type { Transaction, Category } from "./types";
import { Plus, Trash2, ArrowDownLeft, ArrowUpRight } from "lucide-react";

interface TransactionSectionProps {
  transactions: Transaction[];
  categories: Category[];
  onAddTransaction: () => void;
  onDeleteTransaction: (id: string) => void;
}

export function TransactionSection({
  transactions,
  categories,
  onAddTransaction,
  onDeleteTransaction,
}: TransactionSectionProps) {
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="font-heading text-xl">Transactions</CardTitle>
          <CardDescription>Your recent income and expenses</CardDescription>
        </div>
        <Button size="sm" onClick={onAddTransaction} className="shrink-0 gradient-hero text-white border-0">
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <ArrowDownLeft className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="mt-4 font-medium text-foreground">No transactions yet</p>
            <p className="text-sm text-muted-foreground">Add your first income or expense to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 20).map((transaction) => {
              const category = categoryMap.get(transaction.categoryId);
              const Icon = category ? getIcon(category.icon) : ArrowUpRight;
              const isIncome = transaction.type === "income";
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/50 p-4 transition-colors hover:bg-background"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        category?.color ?? "indigo",
                      )}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{transaction.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{category?.name ?? "Uncategorized"}</span>
                        <span>•</span>
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "ml-1 text-xs",
                            isIncome
                              ? "border-accent-cyan/30 text-accent-cyan"
                              : "border-accent-rose/30 text-accent-rose",
                          )}
                        >
                          {isIncome ? "Income" : "Expense"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={cn(
                        "text-right font-semibold",
                        isIncome ? "text-accent-cyan" : "text-accent-rose",
                      )}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>
                    <button
                      onClick={() => onDeleteTransaction(transaction.id)}
                      className="rounded p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete transaction"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
