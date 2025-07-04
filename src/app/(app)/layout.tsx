
"use client"; // This layout uses hooks, so it needs to be a client component

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TransactionsProvider } from "@/contexts/transactions-context"; // Import the provider

// Helper function to get page title from pathname
const getPageTitle = (pathname: string): string => {
  if (pathname.startsWith('/dashboard')) return 'Dashboard';
  if (pathname.startsWith('/transactions')) return 'Transactions';
  if (pathname.startsWith('/reports')) return 'Reports';
  if (pathname.startsWith('/budgets')) return 'Budgets';
  if (pathname.startsWith('/savings-goals')) return 'Savings Goals';
  if (pathname.startsWith('/ai-advice')) return 'AI Financial Advisor';
  if (pathname.startsWith('/settings')) return 'Settings';
  return 'Flow';
};

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <TransactionsProvider> {/* Wrap with TransactionsProvider */}
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <AppHeader pageTitle={pageTitle} />
            <SidebarInset>
              <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
                {children}
              </main>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </TransactionsProvider>
  );
}
