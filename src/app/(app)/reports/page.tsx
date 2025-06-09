
"use client";

import * as React from "react";
import { SpendingBarChart, SpendingPieChart, IncomeExpenseChart } from "@/components/reports/charts";
import { ReportFilters, type ReportFilterValues } from "@/components/reports/filters";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp } from "lucide-react";
import { useTransactions, type Transaction } from "@/contexts/transactions-context";
import { isWithinInterval, format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, compareAsc } from "date-fns";
import type { ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const categoryDisplayNameMap: Record<string, string> = {
  food: "Food & Dining",
  transport: "Transportation",
  housing: "Housing",
  utilities: "Utilities",
  entertainment: "Entertainment",
  health: "Healthcare",
  education: "Education",
  shopping: "Shopping",
  income: "Income",
  other: "Other",
};

const chartColorPalette = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function ReportsPage() {
  const { transactions, isLoading: transactionsLoading } = useTransactions();
  const [filters, setFilters] = React.useState<ReportFilterValues>({
    dateRange: {
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    },
    category: "all",
    transactionType: "all",
  });

  const handleFilterChange = (newFilters: ReportFilterValues) => {
    setFilters(newFilters);
  };

  const filteredTransactions = React.useMemo(() => {
    if (!filters.dateRange.from || !filters.dateRange.to) return [];
    return transactions.filter(t => {
      const transactionDate = typeof t.date === 'string' ? parseISO(t.date) : t.date;
      const dateMatch = isWithinInterval(transactionDate, { start: filters.dateRange.from!, end: filters.dateRange.to! });
      const categoryMatch = filters.category === "all" || t.category === filters.category;
      const typeMatch = filters.transactionType === "all" || t.type === filters.transactionType;
      return dateMatch && categoryMatch && typeMatch;
    });
  }, [transactions, filters]);


  const processedBarChartData = React.useMemo(() => {
    if (!filters.dateRange.from || !filters.dateRange.to || filteredTransactions.length === 0) return { data: [], config: {} };

    const monthsInPeriod = eachMonthOfInterval({
      start: filters.dateRange.from,
      end: filters.dateRange.to
    }).sort(compareAsc);

    const monthlyData: Record<string, Record<string, number>> = {};
    const uniqueCategories = new Set<string>();

    monthsInPeriod.forEach(monthDate => {
      const monthKey = format(monthDate, "MMM yyyy");
      monthlyData[monthKey] = { _monthDate: monthDate.getTime() }; // Store date for sorting
    });
    
    filteredTransactions.forEach(t => {
      if (t.type === 'expense') { // Bar chart typically for expenses
        const monthKey = format(t.date, "MMM yyyy");
        if (monthlyData[monthKey]) {
           const categoryName = categoryDisplayNameMap[t.category] || t.category;
           monthlyData[monthKey][categoryName] = (monthlyData[monthKey][categoryName] || 0) + t.amount;
           uniqueCategories.add(categoryName);
        }
      }
    });
    
    const chartData = Object.entries(monthlyData)
      .sort(([, aData], [, bData]) => (aData._monthDate || 0) - (bData._monthDate || 0))
      .map(([month, data]) => {
        const { _monthDate, ...rest } = data;
        return { month: format(new Date(_monthDate as number), "MMM"), ...rest };
      });

    const chartConfig: ChartConfig = {};
    Array.from(uniqueCategories).forEach((cat, index) => {
      chartConfig[cat] = { label: cat, color: chartColorPalette[index % chartColorPalette.length] };
    });

    return { data: chartData, config: chartConfig };
  }, [filteredTransactions, filters.dateRange]);


  const processedPieChartData = React.useMemo(() => {
    if (filteredTransactions.length === 0) return { data: [], config: {} };
    
    const expenseTransactions = filters.transactionType === 'income' 
      ? [] // If income is selected, pie chart (for expenses) should be empty or show message
      : filteredTransactions.filter(t => t.type === 'expense');

    if (expenseTransactions.length === 0 && filters.transactionType !== 'all') {
        return { data: [], config: {} }; // No expenses to show for pie chart
    }
    
    // If 'all' types are selected, but no expenses, still show empty
    if (expenseTransactions.length === 0 && filters.transactionType === 'all' && !filteredTransactions.some(t => t.type === 'expense')) {
      return { data: [], config: {} };
    }


    const categoryTotals: Record<string, number> = {};
    expenseTransactions.forEach(t => {
      const categoryName = categoryDisplayNameMap[t.category] || t.category;
      categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + t.amount;
    });

    const chartConfig: ChartConfig = {};
    const chartData = Object.entries(categoryTotals).map(([name, value], index) => {
      const color = chartColorPalette[index % chartColorPalette.length];
      chartConfig[name] = { label: name, color: color };
      return { name, value, fill: color };
    }).sort((a,b) => b.value - a.value); // Sort by value descending

    return { data: chartData, config: chartConfig };
  }, [filteredTransactions, filters.transactionType]);


  const processedIncomeExpenseData = React.useMemo(() => {
     if (!filters.dateRange.from || !filters.dateRange.to || filteredTransactions.length === 0) return { data: [], config: {} };
    
    const monthsInPeriod = eachMonthOfInterval({
      start: filters.dateRange.from,
      end: filters.dateRange.to
    }).sort(compareAsc);

    const monthlyData: Record<string, { income: number; expenses: number; _monthDate: number }> = {};
    monthsInPeriod.forEach(monthDate => {
      const monthKey = format(monthDate, "MMM yyyy");
      monthlyData[monthKey] = { income: 0, expenses: 0, _monthDate: monthDate.getTime() };
    });

    filteredTransactions.forEach(t => {
      const monthKey = format(t.date, "MMM yyyy");
      if (monthlyData[monthKey]) {
        if (t.type === 'income') {
          monthlyData[monthKey].income += t.amount;
        } else {
          monthlyData[monthKey].expenses += t.amount;
        }
      }
    });

    const chartData = Object.entries(monthlyData)
      .sort(([, aData], [, bData]) => aData._monthDate - bData._monthDate)
      .map(([month, data]) => ({
        name: format(new Date(data._monthDate), "MMM"),
        income: data.income,
        expenses: data.expenses,
      }));

    const chartConfig: ChartConfig = {
      income: { label: "Income", color: "hsl(var(--chart-1))" },
      expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
    };
    return { data: chartData, config: chartConfig };
  }, [filteredTransactions, filters.dateRange]);
  
  const isAnyDataAvailable = 
    processedBarChartData.data.length > 0 ||
    processedPieChartData.data.length > 0 ||
    processedIncomeExpenseData.data.length > 0;


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Financial Reports</h2>
          <p className="text-muted-foreground">Visualize your spending habits and financial progress.</p>
        </div>
        <Button variant="outline" disabled={transactionsLoading || !isAnyDataAvailable}>
          <Download className="mr-2 h-4 w-4" /> Export Report (PDF)
        </Button>
      </div>
      
      <ReportFilters onFilterChange={handleFilterChange} initialFilters={filters}/>

      {transactionsLoading && (
         <Card>
          <CardHeader>
            <CardTitle>Loading Reports</CardTitle>
            <CardDescription>Fetching your transaction data...</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground">Please wait while we prepare your reports.</p>
          </CardContent>
        </Card>
      )}

      {!transactionsLoading && filteredTransactions.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No Data for Selected Filters</CardTitle>
            <CardDescription>There are no transactions matching your current filter criteria.</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] flex flex-col items-center justify-center text-center">
            <TrendingUp className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Try adjusting the date range, category, or transaction type.</p>
            <p className="text-sm text-muted-foreground mt-1">Or, <a href="/transactions?action=add" className="text-primary hover:underline">add some transactions</a> to get started.</p>
          </CardContent>
        </Card>
      )}

      {!transactionsLoading && filteredTransactions.length > 0 && (
        <>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            <SpendingBarChart data={processedBarChartData.data} chartConfig={processedBarChartData.config} isLoading={transactionsLoading} />
            <SpendingPieChart data={processedPieChartData.data} chartConfig={processedPieChartData.config} isLoading={transactionsLoading} />
          </div>
          
          <div>
            <IncomeExpenseChart data={processedIncomeExpenseData.data} chartConfig={processedIncomeExpenseData.config} isLoading={transactionsLoading}/>
          </div>
        </>
      )}
    </div>
  );
}
