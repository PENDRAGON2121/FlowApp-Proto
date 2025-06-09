
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTransactions, type Transaction } from "@/contexts/transactions-context"; // Import context
import { format } from "date-fns";

// Dummy category map for display - can be centralized later
const categoryMap: Record<string, string> = {
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

export function RecentTransactions() {
  const { transactions, isLoading } = useTransactions();

  // Get the most recent 5 transactions
  const recentTransactions = transactions.slice(0, 5);

  return (
    <Card className="shadow-lg col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                    Loading recent transactions...
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && recentTransactions.length === 0 && (
                 <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                    No recent transactions.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="text-muted-foreground tabular-nums">{format(transaction.date, "MMM dd, yyyy")}</TableCell>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>
                    <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'} className={transaction.type === 'income' ? 'bg-green-100 text-green-700 border-green-300' : ''}>
                      {categoryMap[transaction.category] || transaction.category}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right font-semibold tabular-nums flex items-center justify-end ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? 
                      <ArrowUpCircle className="mr-1 h-4 w-4" /> : 
                      <ArrowDownCircle className="mr-1 h-4 w-4" />
                    }
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
