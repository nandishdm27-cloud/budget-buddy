import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { formatCurrency, cn } from "@/lib/utils";
import type { Goal } from "./types";
import { Plus, Trash2, Target } from "lucide-react";
import { useState } from "react";

interface GoalSectionProps {
  goals: Goal[];
  onAddGoal: () => void;
  onUpdateSaved: (id: string, saved: number) => void;
  onDeleteGoal: (id: string) => void;
}

export function GoalSection({ goals, onAddGoal, onUpdateSaved, onDeleteGoal }: GoalSectionProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="font-heading text-xl">Savings Goals</CardTitle>
          <CardDescription>Track what you are saving for</CardDescription>
        </div>
        <Button size="sm" onClick={onAddGoal} className="shrink-0 gradient-rose text-white border-0">
          <Plus className="h-4 w-4" />
          Add Goal
        </Button>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Target className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="mt-4 font-medium text-foreground">No savings goals yet</p>
            <p className="text-sm text-muted-foreground">Create a goal to start building your savings.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => {
              const percent = goal.target > 0 ? Math.min((goal.saved / goal.target) * 100, 100) : 0;
              return (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  percent={percent}
                  onUpdateSaved={onUpdateSaved}
                  onDeleteGoal={onDeleteGoal}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function GoalCard({
  goal,
  percent,
  onUpdateSaved,
  onDeleteGoal,
}: {
  goal: Goal;
  percent: number;
  onUpdateSaved: (id: string, saved: number) => void;
  onDeleteGoal: (id: string) => void;
}) {
  const [editValue, setEditValue] = useState(String(goal.saved));

  return (
    <div className="group relative rounded-xl border border-border bg-background/50 p-4 transition-colors hover:bg-background">
      <button
        onClick={() => onDeleteGoal(goal.id)}
        className="absolute right-3 top-3 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
        aria-label={`Delete ${goal.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <div className="flex items-center gap-3">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", goal.color)}>
          <Target className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground">{goal.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(goal.saved)} of {formatCurrency(goal.target)}
          </p>
        </div>
      </div>
      <div className="mt-3">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{percent.toFixed(0)}% saved</span>
          <span className="text-xs text-muted-foreground">
            {formatCurrency(Math.max(goal.target - goal.saved, 0))} to go
          </span>
        </div>
        <Progress value={percent} className="h-2 bg-muted" />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Input
          type="number"
          min={0}
          step={1}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => onUpdateSaved(goal.id, Number(editValue) || 0)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onUpdateSaved(goal.id, Number(editValue) || 0);
            }
          }}
          className="h-8 text-sm"
          placeholder="Saved amount"
        />
        <Button
          size="sm"
          className="h-8 shrink-0 gradient-amber text-white border-0"
          onClick={() => onUpdateSaved(goal.id, Number(editValue) || 0)}
        >
          Update
        </Button>
      </div>
    </div>
  );
}
