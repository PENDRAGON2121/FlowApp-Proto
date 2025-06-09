"use client";

import * as React from "react";
import { PlusCircle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BudgetForm, type BudgetFormValues } from "@/components/budgets/budget-form";
import { BudgetTracker } from "@/components/budgets/budget-tracker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Budget extends BudgetFormValues {
  id: string;
  spentAmount: number; // This would come from actual transaction data
}

const monthsName = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const categoryDisplayNameMap: Record<string, string> = {
  food: "Food & Dining",
  transport: "Transportation",
  housing: "Housing",
  utilities: "Utilities",
  entertainment: "Entertainment",
  health: "Healthcare",
  education: "Education",
  shopping: "Shopping",
  other: "Other",
};

const mockBudgetsData: Budget[] = [
  { id: '1', category: 'food', amount: 500, month: '07', year: '2024', spentAmount: 350.75 },
  { id: '2', category: 'transport', amount: 150, month: '07', year: '2024', spentAmount: 165.00 },
  { id: '3', category: 'entertainment', amount: 200, month: '07', year: '2024', spentAmount: 120.00 },
  { id: '4', category: 'shopping', amount: 300, month: '06', year: '2024', spentAmount: 250.00 },
];

export default function BudgetsPage() {
  const [budgets, setBudgets] = React.useState<Budget[]>(mockBudgetsData);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingBudget, setEditingBudget] = React.useState<Budget | undefined>(undefined);
  
  const [selectedMonth, setSelectedMonth] = React.useState<string>((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [selectedYear, setSelectedYear] = React.useState<string>(new Date().getFullYear().toString());

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());
  const monthOptions = monthsName.map((name, index) => ({
    value: (index + 1).toString().padStart(2, '0'),
    label: name,
  }));

  const handleSetBudget = async (data: BudgetFormValues) => {
    const newBudget: Budget = { ...data, id: Date.now().toString(), spentAmount: 0 }; // Reset spentAmount for new/updated
    setBudgets(prev => [...prev.filter(b => !(b.category === data.category && b.month === data.month && b.year === data.year)), newBudget]
      .sort((a,b) => (a.year+a.month).localeCompare(b.year+b.month) || a.category.localeCompare(b.category))
    );
    setIsFormOpen(false);
    setEditingBudget(undefined);
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setIsFormOpen(true);
  };

  const handleDeleteBudget = (id: string) => {
    // Add confirmation dialog in real app
    setBudgets(prev => prev.filter(b => b.id !== id));
  };
  
  const openNewBudgetForm = () => {
    setEditingBudget(undefined);
    setIsFormOpen(true);
  }

  const filteredBudgets = budgets.filter(b => b.month === selectedMonth && b.year === selectedYear);
  const existingCategoriesForPeriod = filteredBudgets.map(b => b.category);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Manage Budgets</h2>
          <p className="text-muted-foreground">Set spending limits and track your progress by category.</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) setEditingBudget(undefined);
          }}>
          <DialogTrigger asChild>
            <Button onClick={openNewBudgetForm} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <PlusCircle className="mr-2 h-4 w-4" /> Set New Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingBudget ? "Edit Budget" : "Set New Budget"}</DialogTitle>
            </DialogHeader>
            <BudgetForm
              onSubmit={handleSetBudget}
              initialData={editingBudget || { month: selectedMonth, year: selectedYear, amount: 0, category: ''}}
              onClose={() => { setIsFormOpen(false); setEditingBudget(undefined); }}
              existingCategoriesForBudgets={editingBudget ? [] : existingCategoriesForPeriod}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-end p-4 border rounded-lg bg-card shadow">
        <div>
          <Label htmlFor="month-select">Month</Label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger id="month-select" className="w-full sm:w-[180px] bg-background">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="year-select">Year</Label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger id="year-select" className="w-full sm:w-[120px] bg-background">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredBudgets.length === 0 ? (
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-medium">No Budgets Set</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            You haven&apos;t set any budgets for {monthsName[parseInt(selectedMonth)-1]} {selectedYear}.
          </p>
          <Button onClick={openNewBudgetForm} className="mt-4 bg-primary hover:bg-primary/90">
            Set First Budget
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBudgets.map((budget) => (
            <BudgetTracker
              key={budget.id}
              categoryName={categoryDisplayNameMap[budget.category] || budget.category}
              budgetAmount={budget.amount}
              spentAmount={budget.spentAmount}
              month={monthsName[parseInt(budget.month)-1]}
              year={budget.year}
              onEdit={() => handleEditBudget(budget)}
              onDelete={() => handleDeleteBudget(budget.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
