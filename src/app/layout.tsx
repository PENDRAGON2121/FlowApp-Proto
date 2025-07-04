import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { GoalsProvider } from "@/contexts/goals-context";
import { TransactionsProvider } from "@/contexts/transactions-context";
import { BudgetsProvider } from "@/contexts/budgets-context";

export const metadata: Metadata = {
  title: 'Flow',
  description: 'Your finances in your hands',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background text-foreground">
        <TransactionsProvider>
          <BudgetsProvider>
            <GoalsProvider>
              {children}
            </GoalsProvider>
          </BudgetsProvider>
        </TransactionsProvider>
        <Toaster />
      </body>
    </html>
  );
}
