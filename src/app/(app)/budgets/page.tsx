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
import { useBudgets } from "@/contexts/budgets-context";
import { useTransactions } from "@/contexts/transactions-context";

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

export default function BudgetsPage() {
  const { budgets, addBudget, updateBudget, deleteBudget, isLoading: isBudgetsLoading } = useBudgets();
  const { transactions, isLoading: isTransactionsLoading } = useTransactions();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingBudget, setEditingBudget] = React.useState<BudgetFormValues | undefined>(undefined);
  
  const [selectedMonth, setSelectedMonth] = React.useState<string>((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [selectedYear, setSelectedYear] = React.useState<string>(new Date().getFullYear().toString());

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());
  const monthOptions = monthsName.map((name, index) => ({
    value: (index + 1).toString().padStart(2, '0'),
    label: name,
  }));

  // Calcular gastos por categoría para el período seleccionado
  const expensesByCategory = React.useMemo(() => {
    return transactions
      .filter(t => 
        t.type === 'expense' && 
        t.date.getMonth() + 1 === parseInt(selectedMonth) &&
        t.date.getFullYear().toString() === selectedYear
      )
      .reduce((acc, t) => {
        const category = t.category;
        acc[category] = (acc[category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
  }, [transactions, selectedMonth, selectedYear]);

  const handleSetBudget = async (data: BudgetFormValues) => {
    if (editingBudget) {
      updateBudget(editingBudget.id!, {
        category: data.category,
        limit: data.amount,
        period: 'monthly'
      });
    } else {
      addBudget({
        category: data.category,
        limit: data.amount,
        period: 'monthly'
      });
    }
    setIsFormOpen(false);
    setEditingBudget(undefined);
  };

  const handleEditBudget = (budget: BudgetFormValues) => {
    setEditingBudget(budget);
    setIsFormOpen(true);
  };

  const handleDeleteBudget = (id: string) => {
    deleteBudget(id);
  };
  
  const openNewBudgetForm = () => {
    setEditingBudget(undefined);
    setIsFormOpen(true);
  }

  const filteredBudgets = budgets.filter(b => b.period === 'monthly');
  const existingCategoriesForPeriod = filteredBudgets.map(b => b.category);

  if (isBudgetsLoading || isTransactionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Cargando presupuestos...</p>
      </div>
    );
  }

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
              budgetAmount={budget.limit}
              spentAmount={expensesByCategory[budget.category] || 0}
              month={monthsName[parseInt(selectedMonth)-1]}
              year={selectedYear}
              onEdit={() => handleEditBudget(budget)}
              onDelete={() => handleDeleteBudget(budget.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
