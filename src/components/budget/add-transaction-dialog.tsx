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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Transaction, Category } from "./types";

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onAdd: (transaction: Omit<Transaction, "id">) => void;
}

export function AddTransactionDialog({ open, onOpenChange, categories, onAdd }: AddTransactionDialogProps) {
  const [type, setType] = useState<Transaction["type"]>"expense");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const reset = () => {
    setType("expense");
    setAmount("");
    setCategoryId(categories[0]?.id ?? "");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0 || !categoryId) return;
    onAdd({
      type,
      amount: value,
      categoryId,
      description: description.trim() || (type === "income" ? "Income" : "Expense"),
      date,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card text-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Add Transaction</DialogTitle>
          <DialogDescription>Record a new income or expense.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as Transaction["type"])}>
              <SelectTrigger id="type" className="border-border bg-background">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="border-border bg-card">
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              min={0.01}
              step={0.01}
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border-border bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger id="category" className="border-border bg-background">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="border-border bg-card">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder={type === "income" ? "Part-time job" : "Grocery run"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-border bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-border bg-background"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border"
            >
              Cancel
            </Button>
            <Button type="submit" className="gradient-hero text-white border-0">
              Add Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
