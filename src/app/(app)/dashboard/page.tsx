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

export default function DashboardPage() {
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
          value="$5,231.89"
          icon={TrendingUp}
          iconClassName="text-green-500"
          footerText="+20.1% from last month"
        />
        <SummaryCard
          title="Total Expenses"
          value="$2,780.45"
          icon={TrendingDown}
          iconClassName="text-red-500"
          footerText="+12.5% from last month"
        />
        <SummaryCard
          title="Current Balance"
          value="$2,451.44"
          icon={DollarSign}
          iconClassName="text-primary"
        />
        <SummaryCard
          title="Active Budgets"
          value="5"
          icon={CreditCard}
          footerText="2 Overspent"
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
