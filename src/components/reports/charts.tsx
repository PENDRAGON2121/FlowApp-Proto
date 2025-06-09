
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart as RechartsPieChartComponent, Cell, Legend, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig
} from "@/components/ui/chart"
import { TrendingUp } from "lucide-react";

interface SpendingBarChartProps {
  data: any[];
  chartConfig: ChartConfig;
  isLoading?: boolean;
}

export function SpendingBarChart({ data, chartConfig, isLoading }: SpendingBarChartProps) {
  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Monthly Spending by Category</CardTitle>
          <CardDescription>Loading data...</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          <p>Loading chart data...</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
     return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Monthly Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex flex-col items-center justify-center text-center text-muted-foreground">
           <TrendingUp className="h-12 w-12 mb-4" />
          <p className="font-semibold">No spending data available</p>
          <p className="text-sm">Try adjusting your filters or adding transactions.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Monthly Spending by Category</CardTitle>
        <CardDescription>Breakdown of spending over selected period.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis tickFormatter={(value) => `$${value}`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {Object.keys(chartConfig).map((categoryKey) => (
              <Bar key={categoryKey} dataKey={categoryKey} fill={`var(--color-${categoryKey})`} radius={4} />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

interface SpendingPieChartProps {
  data: { name: string; value: number; fill: string }[];
  chartConfig: ChartConfig;
  isLoading?: boolean;
}

export function SpendingPieChart({ data, chartConfig, isLoading }: SpendingPieChartProps) {
   if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Spending Distribution</CardTitle>
          <CardDescription>Loading data...</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          <p>Loading chart data...</p>
        </CardContent>
      </Card>
    );
  }
  if (!data || data.length === 0) {
     return (
      <Card className="shadow-lg">
        <CardHeader className="items-center pb-0">
          <CardTitle>Spending Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0 h-[300px] flex flex-col items-center justify-center text-center text-muted-foreground">
           <TrendingUp className="h-12 w-12 mb-4" />
          <p className="font-semibold">No spending data for pie chart</p>
          <p className="text-sm">Select 'Expense' type or check filters.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col shadow-lg">
      <CardHeader className="items-center pb-0">
        <CardTitle>Spending Distribution</CardTitle>
        <CardDescription>Breakdown by category for selected period.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <RechartsPieChartComponent>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
               {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
             <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </RechartsPieChartComponent>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}


interface IncomeExpenseChartProps {
  data: { name: string; income: number; expenses: number }[];
  chartConfig: ChartConfig;
  isLoading?: boolean;
}
export function IncomeExpenseChart({ data, chartConfig, isLoading }: IncomeExpenseChartProps) {
   if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Income vs. Expenses</CardTitle>
          <CardDescription>Loading data...</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          <p>Loading chart data...</p>
        </CardContent>
      </Card>
    );
  }
  if (!data || data.length === 0) {
     return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Income vs. Expenses</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex flex-col items-center justify-center text-center text-muted-foreground">
           <TrendingUp className="h-12 w-12 mb-4" />
          <p className="font-semibold">No income/expense data available</p>
          <p className="text-sm">Try adjusting your filters or adding transactions.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Income vs. Expenses</CardTitle>
        <CardDescription>Overview of cash flow for the selected period.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}/>
              <Legend />
              <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
