import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Category, BudgetPeriod } from "./types";
import { getPeriodTitle } from "./types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface CategoryWithSpending extends Category {
  spent: number;
}

interface ChartSectionProps {
  period: BudgetPeriod;
  categories: CategoryWithSpending[];
}

const COLOR_MAP: Record<string, string> = {
  indigo: "#6366f1",
  rose: "#f43f5e",
  amber: "#fbbf24",
  cyan: "#22d3ee",
  lime: "#84cc16",
};

export function ChartSection({ period, categories }: ChartSectionProps) {
  const data = categories
    .filter((c) => c.spent > 0)
    .map((c) => ({
      name: c.name,
      value: c.spent,
      color: COLOR_MAP[c.color] ?? "#6366f1",
    }));

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const periodTitle = getPeriodTitle(period).toLowerCase();

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="font-heading text-xl">Spending Breakdown</CardTitle>
        <CardDescription>Where your money went this {periodTitle}</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border text-center">
            <p className="text-sm text-muted-foreground">Add expenses to see your spending chart.</p>
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.2)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), "Spent"]}
                  contentStyle={{
                    backgroundColor: "oklch(0.195 0.04 264)",
                    border: "1px solid oklch(1 0 0 / 12%)",
                    borderRadius: "0.75rem",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value: string) => <span className="text-foreground text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        {total > 0 && (
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Total spent this {periodTitle}: <span className="font-semibold text-foreground">{formatCurrency(total)}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
