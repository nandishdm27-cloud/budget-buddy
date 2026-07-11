import { TrendingDown, TrendingUp, Wallet, PiggyBank } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface SummaryCardsProps {
  income: number;
  expenses: number;
  balance: number;
  totalSaved: number;
}

export function SummaryCards({ income, expenses, balance, totalSaved }: SummaryCardsProps) {
  const items = [
    {
      label: "Total Income",
      value: income,
      icon: TrendingUp,
      color: "text-accent-cyan",
      bg: "bg-accent-cyan/10",
      glow: "glow-cyan",
    },
    {
      label: "Total Expenses",
      value: expenses,
      icon: TrendingDown,
      color: "text-accent-rose",
      bg: "bg-accent-rose/10",
      glow: "glow-rose",
    },
    {
      label: "Remaining",
      value: balance,
      icon: Wallet,
      color: "text-accent-indigo",
      bg: "bg-accent-indigo/10",
      glow: "glow-indigo",
    },
    {
      label: "Saved Towards Goals",
      value: totalSaved,
      icon: PiggyBank,
      color: "text-accent-amber",
      bg: "bg-accent-amber/10",
      glow: "",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card
          key={item.label}
          className={`relative overflow-hidden border-border bg-card transition-transform hover:-translate-y-1 ${item.glow}`}
        >
          <CardContent className="flex items-center gap-4 p-6">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.bg}`}>
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                {formatCurrency(item.value)}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
