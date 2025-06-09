
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit3, Trash2, ArrowUpCircle, ArrowDownCircle, Filter, Download } from "lucide-react";
import { TransactionForm, type TransactionFormValues } from "@/components/transactions/transaction-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface Transaction extends TransactionFormValues {
  id: string;
}

const mockTransactionsData: Transaction[] = [
  { id: '1', date: new Date('2024-07-15'), description: 'Groceries at Walmart', amount: 55.20, type: 'expense', category: 'food' },
  { id: '2', date: new Date('2024-07-14'), description: 'Monthly Salary', amount: 2500.00, type: 'income', category: 'income' },
  { id: '3', date: new Date('2024-07-13'), description: 'Netflix Subscription', amount: 15.00, type: 'expense', category: 'entertainment' },
  { id: '4', date: new Date('2024-07-12'), description: 'Gasoline for Car', amount: 40.00, type: 'expense', category: 'transport' },
  { id: '5', date: new Date('2024-07-11'), description: 'Freelance Web Design Project', amount: 300.00, type: 'income', category: 'income' },
  { id: '6', date: new Date('2024-07-10'), description: 'Dinner with Friends', amount: 75.50, type: 'expense', category: 'food' },
  { id: '7', date: new Date('2024-07-09'), description: 'Electricity Bill', amount: 65.00, type: 'expense', category: 'utilities' },
];

// Dummy category map for display
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


export default function TransactionsPage() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]); // Initialize with empty array
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingTransaction, setEditingTransaction] = React.useState<Transaction | undefined>(undefined);
  const { toast } = useToast();

  React.useEffect(() => {
    // Set initial transactions on the client side to avoid hydration mismatch
    setTransactions(
        mockTransactionsData.sort((a, b) => b.date.getTime() - a.date.getTime())
    );
  }, []); // Empty dependency array ensures this runs once on mount on the client


  const handleAddTransaction = async (data: TransactionFormValues) => {
    const newTransaction: Transaction = { ...data, id: Date.now().toString() };
    setTransactions(prev => [newTransaction, ...prev].sort((a,b) => b.date.getTime() - a.date.getTime() ));
    setIsFormOpen(false);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };
  
  const handleUpdateTransaction = async (data: TransactionFormValues) => {
    if (!editingTransaction) return;
    setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? { ...editingTransaction, ...data } : t).sort((a,b) => b.date.getTime() - a.date.getTime()));
    setIsFormOpen(false);
    setEditingTransaction(undefined);
  };

  const handleDeleteTransaction = (id: string) => {
    // Add a confirmation dialog here in a real app
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast({ title: "Transaction Deleted", description: "The transaction has been removed."});
  };

  const openNewTransactionForm = () => {
    setEditingTransaction(undefined);
    setIsFormOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Manage Transactions</h2>
          <p className="text-muted-foreground">Keep track of your income and expenses.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Dialog open={isFormOpen} onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) setEditingTransaction(undefined);
          }}>
            <DialogTrigger asChild>
              <Button onClick={openNewTransactionForm} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>{editingTransaction ? "Edit Transaction" : "Add New Transaction"}</DialogTitle>
              </DialogHeader>
              <TransactionForm
                onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
                initialData={editingTransaction}
                onClose={() => {
                  setIsFormOpen(false);
                  setEditingTransaction(undefined);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View and manage all your recorded financial activities.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Loading transactions or no transactions yet...
                    </TableCell>
                  </TableRow>
                )}
                {transactions.map((transaction) => (
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
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" onClick={() => handleEditTransaction(transaction)} className="text-primary hover:text-primary/80">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTransaction(transaction.id)} className="text-destructive hover:text-destructive/80">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
