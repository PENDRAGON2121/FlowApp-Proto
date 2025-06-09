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

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

const mockTransactions: Transaction[] = [
  { id: '1', date: '2024-07-15', description: 'Groceries', amount: 55.20, type: 'expense', category: 'Food' },
  { id: '2', date: '2024-07-14', description: 'Salary', amount: 2500.00, type: 'income', category: 'Work' },
  { id: '3', date: '2024-07-13', description: 'Netflix Subscription', amount: 15.00, type: 'expense', category: 'Entertainment' },
  { id: '4', date: '2024-07-12', description: 'Gasoline', amount: 40.00, type: 'expense', category: 'Transport' },
  { id: '5', date: '2024-07-11', description: 'Freelance Project', amount: 300.00, type: 'income', category: 'Side Hustle' },
];

export function RecentTransactions() {
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
              {mockTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="text-muted-foreground">{transaction.date}</TableCell>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{transaction.category}</Badge>
                  </TableCell>
                  <TableCell className={`text-right font-semibold flex items-center justify-end ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
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
