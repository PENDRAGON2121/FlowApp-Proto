import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Edit3, Trash2, Target } from "lucide-react";
import { format, differenceInDays, formatDistanceToNowStrict } from 'date-fns';

interface SavingsGoalProgressCardProps {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddFunds?: (id: string) => void; // Optional: for a quick add funds button
}

export function SavingsGoalProgressCard({
  id, name, targetAmount, currentAmount, deadline, onEdit, onDelete, onAddFunds
}: SavingsGoalProgressCardProps) {
  const progress = Math.min((currentAmount / targetAmount) * 100, 100);
  const remainingAmount = targetAmount - currentAmount;
  const isCompleted = currentAmount >= targetAmount;

  let deadlineText = "No deadline set";
  if (deadline) {
    if (isCompleted) {
      deadlineText = `Completed!`;
    } else if (new Date() > deadline) {
      deadlineText = `Deadline passed (${format(deadline, "MMM dd, yyyy")})`;
    } else {
      deadlineText = `${formatDistanceToNowStrict(deadline, { addSuffix: true })} left (${format(deadline, "MMM dd, yyyy")})`;
    }
  }
  
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            <CardTitle className="text-lg">{name}</CardTitle>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(id)} className="h-7 w-7"><Edit3 className="h-4 w-4 text-primary" /></Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(id)} className="h-7 w-7"><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        </div>
        <CardDescription>
           {isCompleted ? "Goal Achieved!" : deadlineText}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-2">
          <Progress value={progress} className="h-3 [&>div]:bg-accent" />
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-muted-foreground">
            Saved: <span className="font-semibold text-foreground">${currentAmount.toLocaleString()}</span>
          </span>
          <span className="font-semibold text-foreground">
            Target: ${targetAmount.toLocaleString()}
          </span>
        </div>
        {!isCompleted && remainingAmount > 0 && (
           <p className="text-sm text-muted-foreground mt-1">
             ${remainingAmount.toLocaleString()} more to go.
           </p>
        )}
      </CardContent>
      {!isCompleted && onAddFunds && (
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => onAddFunds(id)}>
            Add Funds
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
