import { SpendingBarChart, SpendingPieChart, IncomeExpenseChart } from "@/components/reports/charts";
import { ReportFilters } from "@/components/reports/filters";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Financial Reports</h2>
          <p className="text-muted-foreground">Visualize your spending habits and financial progress.</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export Report (PDF)
        </Button>
      </div>
      
      <ReportFilters />

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <SpendingBarChart />
        <SpendingPieChart />
      </div>
      
      <div>
        <IncomeExpenseChart />
      </div>
      
      {/* Placeholder for more reports */}
      {/* 
      <Card>
        <CardHeader>
          <CardTitle>More Reports Coming Soon</CardTitle>
          <CardDescription>We are working on adding more insightful reports.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Stay tuned for reports on net worth, debt payoff progress, and more!</p>
        </CardContent>
      </Card>
      */}
    </div>
  );
}
