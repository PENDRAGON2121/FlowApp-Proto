
"use client";

import type { TransactionFormValues } from "@/components/transactions/transaction-form";
import * as React from "react";
import { format } from "date-fns";

// Define the Transaction type based on its usage
export interface Transaction extends TransactionFormValues {
  id: string;
}

// Initial mock data - ensure dates are handled correctly for client-side initialization
const initialMockTransactionsData: Omit<Transaction, 'id' | 'date'> & { id: string, date: string }[] = [
  { id: '1', date: '2024-07-15', description: 'Groceries at Walmart', amount: 55.20, type: 'expense', category: 'food' },
  { id: '2', date: '2024-07-14', description: 'Monthly Salary', amount: 2500.00, type: 'income', category: 'income' },
  { id: '3', date: '2024-07-13', description: 'Netflix Subscription', amount: 15.00, type: 'expense', category: 'entertainment' },
  { id: '4', date: '2024-07-12', description: 'Gasoline for Car', amount: 40.00, type: 'expense', category: 'transport' },
  { id: '5', date: '2024-07-11', description: 'Freelance Web Design Project', amount: 300.00, type: 'income', category: 'income' },
  { id: '6', date: '2024-07-10', description: 'Dinner with Friends', amount: 75.50, type: 'expense', category: 'food' },
  { id: '7', date: '2024-07-09', description: 'Electricity Bill', amount: 65.00, type: 'expense', category: 'utilities' },
];


interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction: (data: TransactionFormValues) => void;
  updateTransaction: (id: string, data: TransactionFormValues) => void;
  deleteTransaction: (id: string) => void;
  isLoading: boolean;
}

const TransactionsContext = React.createContext<TransactionsContextType | undefined>(undefined);

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Initialize with mock data on the client side to avoid hydration issues
    // And convert string dates to Date objects
    const processedMockData = initialMockTransactionsData
      .map(t => ({ ...t, date: new Date(t.date) }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
    setTransactions(processedMockData);
    setIsLoading(false);
  }, []);

  const addTransaction = (data: TransactionFormValues) => {
    const newTransaction: Transaction = { ...data, id: Date.now().toString() };
    setTransactions(prev => [newTransaction, ...prev].sort((a,b) => b.date.getTime() - a.date.getTime() ));
  };

  const updateTransaction = (id: string, data: TransactionFormValues) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, ...data } : t)).sort((a,b) => b.date.getTime() - a.date.getTime() )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction, updateTransaction, deleteTransaction, isLoading }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = React.useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionsProvider");
  }
  return context;
}
