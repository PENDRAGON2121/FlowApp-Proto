"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell, Legend, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
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

const monthlySpendingData = [
  { month: "Jan", Food: 400, Transport: 120, Utilities: 200, Entertainment: 150 },
  { month: "Feb", Food: 350, Transport: 110, Utilities: 180, Entertainment: 120 },
  { month: "Mar", Food: 420, Transport: 130, Utilities: 210, Entertainment: 160 },
  { month: "Apr", Food: 380, Transport: 100, Utilities: 190, Entertainment: 140 },
  { month: "May", Food: 450, Transport: 140, Utilities: 220, Entertainment: 170 },
  { month: "Jun", Food: 410, Transport: 125, Utilities: 205, Entertainment: 155 },
];

const chartConfigBar: ChartConfig = {
  Food: { label: "Food", color: "hsl(var(--chart-1))" },
  Transport: { label: "Transport", color: "hsl(var(--chart-2))" },
  Utilities: { label: "Utilities", color: "hsl(var(--chart-3))" },
  Entertainment: { label: "Entertainment", color: "hsl(var(--chart-4))" },
};

const categorySpendingData = [
  { name: "Food", value: 1250, fill: "hsl(var(--chart-1))" },
  { name: "Transport", value: 780, fill: "hsl(var(--chart-2))" },
  { name: "Utilities", value: 1100, fill: "hsl(var(--chart-3))" },
  { name: "Entertainment", value: 900, fill: "hsl(var(--chart-4))" },
  { name: "Shopping", value: 600, fill: "hsl(var(--chart-5))" },
];

const chartConfigPie: ChartConfig = {
  Food: { label: "Food", color: "hsl(var(--chart-1))" },
  Transport: { label: "Transport", color: "hsl(var(--chart-2))" },
  Utilities: { label: "Utilities", color: "hsl(var(--chart-3))" },
  Entertainment: { label: "Entertainment", color: "hsl(var(--chart-4))" },
  Shopping: { label: "Shopping", color: "hsl(var(--chart-5))" },
};


export function SpendingBarChart() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Monthly Spending by Category</CardTitle>
        <CardDescription>Last 6 Months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfigBar} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={monthlySpendingData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis tickFormatter={(value) => `$${value}`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="Food" fill="var(--color-Food)" radius={4} />
            <Bar dataKey="Transport" fill="var(--color-Transport)" radius={4} />
            <Bar dataKey="Utilities" fill="var(--color-Utilities)" radius={4} />
            <Bar dataKey="Entertainment" fill="var(--color-Entertainment)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function SpendingPieChart() {
  return (
    <Card className="flex flex-col shadow-lg">
      <CardHeader className="items-center pb-0">
        <CardTitle>Spending Distribution</CardTitle>
        <CardDescription>Current Month Breakdown</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfigPie}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={categorySpendingData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
               {categorySpendingData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
              ))}
            </Pie>
             <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function IncomeExpenseChart() {
 const data = [
    { name: 'Jan', income: 4000, expenses: 2400 },
    { name: 'Feb', income: 3000, expenses: 1398 },
    { name: 'Mar', income: 2000, expenses: 3800 },
    { name: 'Apr', income: 2780, expenses: 1908 },
    { name: 'May', income: 1890, expenses: 2800 },
    { name: 'Jun', income: 2390, expenses: 2100 },
  ];

  const chartConfig: ChartConfig = {
    income: { label: "Income", color: "hsl(var(--chart-1))" },
    expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Income vs. Expenses</CardTitle>
        <CardDescription>Overview of your cash flow for the last 6 months.</CardDescription>
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
