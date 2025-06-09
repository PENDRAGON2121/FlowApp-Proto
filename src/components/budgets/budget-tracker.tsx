import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BudgetTrackerProps {
  categoryName: string;
  budgetAmount: number;
  spentAmount: number;
  month: string;
  year: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function BudgetTracker({ 
  categoryName, 
  budgetAmount, 
  spentAmount, 
  month,
  year,
  onEdit, 
  onDelete 
}: BudgetTrackerProps) {
  const progress = Math.min((spentAmount / budgetAmount) * 100, 100);
  const remainingAmount = budgetAmount - spentAmount;
  const isOverBudget = spentAmount > budgetAmount;

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{categoryName}</CardTitle>
            <CardDescription>{month} {year}</CardDescription>
          </div>
          <div className="flex gap-1">
            {onEdit && <Button variant="ghost" size="icon" onClick={onEdit} className="h-7 w-7"><Edit3 className="h-4 w-4 text-primary" /></Button>}
            {onDelete && <Button variant="ghost" size="icon" onClick={onDelete} className="h-7 w-7"><Trash2 className="h-4 w-4 text-destructive" /></Button>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <Progress value={progress} className={cn("h-3", isOverBudget ? "[&>div]:bg-red-500" : "[&>div]:bg-accent")} />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Spent: <span className="font-semibold text-foreground">${spentAmount.toFixed(2)}</span></span>
          <span className={cn("font-semibold", isOverBudget ? "text-red-500" : "text-green-600")}>
            {isOverBudget 
              ? `Over by $${Math.abs(remainingAmount).toFixed(2)}` 
              : `Remaining: $${remainingAmount.toFixed(2)}`}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Budget: ${budgetAmount.toFixed(2)}</p>
         {isOverBudget && (
          <p className="text-xs text-red-500 font-medium mt-1">
            You&apos;ve exceeded the budget for {categoryName}!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
