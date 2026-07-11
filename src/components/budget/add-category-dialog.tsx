"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category, AccentColor, BudgetPeriod } from "./types";
import { ACCENT_COLORS, toMonthlyBudget, getPeriodTitle } from "./types";
import { cn } from "@/lib/utils";

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  period: BudgetPeriod;
  onAdd: (category: Omit<Category, "id">) => void;
}

export function AddCategoryDialog({ open, onOpenChange, period, onAdd }: AddCategoryDialogProps) {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [color, setColor] = useState<AccentColor>("indigo");

  const reset = () => {
    setName("");
    setBudget("");
    setColor("indigo");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(budget);
    if (!name.trim() || value <= 0) return;
    onAdd({
      name: name.trim(),
      budget: toMonthlyBudget(value, period),
      color,
      icon: "more-horizontal",
    });
    reset();
    onOpenChange(false);
  };

  const periodLabel = getPeriodTitle(period);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Add Budget Category</DialogTitle>
          <DialogDescription>
            Create a new category with a {periodLabel.toLowerCase()} spending limit.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              placeholder="e.g., Subscriptions"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-border bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-budget">{periodLabel} Budget</Label>
            <Input
              id="category-budget"
              type="number"
              min={0.01}
              step={0.01}
              required
              placeholder="0.00"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="border-border bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={cn(
                    "h-8 w-8 rounded-full transition-transform",
                    c.class,
                    color === c.value && "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110",
                  )}
                  aria-label={`Select ${c.label}`}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-border">
              Cancel
            </Button>
            <Button type="submit" className="gradient-hero text-white border-0">
              Add Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
