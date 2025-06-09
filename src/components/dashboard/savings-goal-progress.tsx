import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Goal } from "lucide-react";

interface SavingsGoalItem {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

const mockGoals: SavingsGoalItem[] = [
  { id: '1', name: 'New Laptop', targetAmount: 1500, currentAmount: 750, deadline: '2024-12-31' },
  { id: '2', name: 'Vacation Fund', targetAmount: 3000, currentAmount: 2800, deadline: '2025-06-30' },
  { id: '3', name: 'Emergency Fund', targetAmount: 5000, currentAmount: 1200 },
];

export function SavingsGoalsOverview() {
  return (
    <Card className="shadow-lg col-span-1 md:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Goal className="mr-2 h-5 w-5 text-primary" />
          Savings Goals
        </CardTitle>
        <CardDescription>Track your progress towards your financial milestones.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {mockGoals.slice(0,2).map((goal) => ( // Show a couple of goals on dashboard
          <div key={goal.id}>
            <div className="mb-1 flex justify-between items-baseline">
              <span className="text-sm font-medium text-foreground">{goal.name}</span>
              <span className="text-xs text-muted-foreground">
                ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
              </span>
            </div>
            <Progress value={(goal.currentAmount / goal.targetAmount) * 100} className="h-3 [&>div]:bg-accent" />
            {goal.deadline && <p className="text-xs text-muted-foreground mt-1">Deadline: {goal.deadline}</p>}
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline" asChild className="w-full">
          <Link href="/savings-goals">View All Goals</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
