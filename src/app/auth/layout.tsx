import type { ReactNode } from 'react';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex items-center space-x-3">
        <Image src="https://placehold.co/64x64.png?bg=3F51B5&fc=FFFFFF" alt="WalletSage Logo" width={64} height={64} className="rounded-lg" data-ai-hint="logo finance" />
        <h1 className="text-4xl font-headline font-bold text-primary">WalletSage</h1>
      </div>
      <div className="w-full max-w-md rounded-lg bg-card p-8 shadow-xl">
        {children}
      </div>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Your personal finance companion.
      </p>
    </div>
  );
}
