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
import type { Goal, AccentColor } from "./types";
import { ACCENT_COLORS } from "./types";
import { cn } from "@/lib/utils";

interface AddGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (goal: Omit<Goal, "id">) => void;
}

export function AddGoalDialog({ open, onOpenChange, onAdd }: AddGoalDialogProps) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("0");
  const [color, setColor] = useState<AccentColor>("indigo");

  const reset = () => {
    setName("");
    setTarget("");
    setSaved("0");
    setColor("indigo");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetValue = Number(target);
    const savedValue = Number(saved);
    if (!name.trim() || targetValue <= 0) return;
    onAdd({
      name: name.trim(),
      target: targetValue,
      saved: savedValue,
      color,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Add Savings Goal</DialogTitle>
          <DialogDescription>Set a target and start saving toward something meaningful.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-name">Goal Name</Label>
            <Input
              id="goal-name"
              placeholder="e.g., Summer Internship Fund"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-border bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-target">Target Amount</Label>
            <Input
              id="goal-target"
              type="number"
              min={0.01}
              step={0.01}
              required
              placeholder="0.00"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="border-border bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-saved">Already Saved (optional)</Label>
            <Input
              id="goal-saved"
              type="number"
              min={0}
              step={0.01}
              placeholder="0.00"
              value={saved}
              onChange={(e) => setSaved(e.target.value)}
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
            <Button type="submit" className="gradient-rose text-white border-0">
              Add Goal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
