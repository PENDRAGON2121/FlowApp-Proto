"use client"; // Make this a client component

import { DollarSign, TrendingUp, TrendingDown, CreditCard, PlusCircle } from "lucide-react";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { SavingsGoalsOverview } from "@/components/dashboard/savings-goal-progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useTransactions } from "@/contexts/transactions-context";
import { useBudgets } from "@/contexts/budgets-context";
import { useMemo } from "react";

// Definir los límites de presupuesto por categoría
const BUDGET_LIMITS: Record<string, number> = {
  food: 500,
  transportation: 300,
  entertainment: 200,
  utilities: 400,
  shopping: 300,
  // Añade más categorías según necesites
};

export default function DashboardPage() {
  const { transactions, isLoading: isTransactionsLoading } = useTransactions();
  const { budgets, isLoading: isBudgetsLoading } = useBudgets();

  const { totalIncome, totalExpenses, currentBalance, activeBudgets, overspentBudgets } = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Filtrar transacciones del mes actual
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() + 1 === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const income = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calcular gastos por categoría para el mes actual
    const expensesByCategory = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const category = t.category;
        acc[category] = (acc[category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    // Filtrar presupuestos del mes actual
    const currentMonthBudgets = budgets.filter(budget => {
      const budgetDate = new Date(budget.date);
      return budgetDate.getMonth() + 1 === currentMonth && 
             budgetDate.getFullYear() === currentYear;
    });

    // Encontrar categorías con presupuesto activo y que tengan gastos
    const activeCategories = currentMonthBudgets.filter(
      budget => expensesByCategory[budget.category] !== undefined && expensesByCategory[budget.category] > 0
    );

    // Encontrar categorías que exceden su presupuesto
    const overspent = activeCategories.filter(
      budget => (expensesByCategory[budget.category] || 0) > budget.limit
    );

    return {
      totalIncome: income,
      totalExpenses: expenses,
      currentBalance: income - expenses,
      activeBudgets: activeCategories.length,
      overspentBudgets: overspent.length
    };
  }, [transactions, budgets]);

  if (isTransactionsLoading || isBudgetsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Cargando datos financieros...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Financial Overview</h2>
          <p className="text-muted-foreground">Welcome back to Flow! Here&apos;s your current financial status.</p>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/transactions?action=add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Income"
          value={`$${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={TrendingUp}
          iconClassName="text-green-500"
        />
        <SummaryCard
          title="Total Expenses"
          value={`$${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={TrendingDown}
          iconClassName="text-red-500"
        />
        <SummaryCard
          title="Current Balance"
          value={`$${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          iconClassName={currentBalance >= 0 ? "text-green-500" : "text-red-500"}
        />
        <SummaryCard
          title="Active Budgets"
          value={activeBudgets.toString()}
          icon={CreditCard}
          footerText={overspentBudgets > 0 ? `${overspentBudgets} Overspent` : undefined}
          iconClassName={overspentBudgets > 0 ? "text-red-500" : "text-primary"}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <RecentTransactions />
        <SavingsGoalsOverview />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Financial Tip of the Day</CardTitle>
          <CardDescription>Smart advice to help you manage your money better.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-6">
          <Image 
            src="https://placehold.co/300x200.png?bg=E8EAF6" 
            alt="Financial Tip Illustration" 
            width={300} 
            height={200} 
            className="rounded-lg object-cover"
            data-ai-hint="finance illustration" 
          />
          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary">Automate Your Savings</h3>
            <p className="text-muted-foreground mb-4">
              Set up automatic transfers to your savings account each payday. Even small, consistent amounts can add up significantly over time. This &quot;pay yourself first&quot; strategy ensures you&apos;re always building your savings.
            </p>
            <Button variant="outline" asChild>
              <Link href="/ai-advice">Get AI Advice</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
