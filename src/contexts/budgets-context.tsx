"use client";

import * as React from "react";

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
}

// Datos iniciales de ejemplo
const initialMockBudgetsData: Budget[] = [
  {
    id: '1',
    category: 'food',
    limit: 500,
    spent: 0,
    period: 'monthly'
  },
  {
    id: '2',
    category: 'transportation',
    limit: 300,
    spent: 0,
    period: 'monthly'
  },
  {
    id: '3',
    category: 'entertainment',
    limit: 200,
    spent: 0,
    period: 'monthly'
  },
  {
    id: '4',
    category: 'utilities',
    limit: 400,
    spent: 0,
    period: 'monthly'
  },
  {
    id: '5',
    category: 'shopping',
    limit: 300,
    spent: 0,
    period: 'monthly'
  }
];

interface BudgetsContextType {
  budgets: Budget[];
  addBudget: (data: Omit<Budget, 'id' | 'spent'>) => void;
  updateBudget: (id: string, data: Partial<Omit<Budget, 'id' | 'spent'>>) => void;
  deleteBudget: (id: string) => void;
  updateSpent: (category: string, amount: number) => void;
  isLoading: boolean;
}

const BudgetsContext = React.createContext<BudgetsContextType | undefined>(undefined);

const STORAGE_KEY = 'budgets-data';

export function BudgetsProvider({ children }: { children: React.ReactNode }) {
  const [budgets, setBudgets] = React.useState<Budget[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Cargar datos del localStorage al iniciar
  React.useEffect(() => {
    try {
      const storedBudgets = localStorage.getItem(STORAGE_KEY);
      if (storedBudgets) {
        setBudgets(JSON.parse(storedBudgets));
      } else {
        setBudgets(initialMockBudgetsData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockBudgetsData));
      }
    } catch (error) {
      console.error('Error loading budgets from localStorage:', error);
      setBudgets(initialMockBudgetsData);
    }
    setIsLoading(false);
  }, []);

  // Guardar en localStorage cada vez que budgets cambie
  React.useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
    }
  }, [budgets, isLoading]);

  const addBudget = (data: Omit<Budget, 'id' | 'spent'>) => {
    const newBudget: Budget = {
      ...data,
      id: Date.now().toString(),
      spent: 0
    };
    setBudgets(prev => [...prev, newBudget]);
  };

  const updateBudget = (id: string, data: Partial<Omit<Budget, 'id' | 'spent'>>) => {
    setBudgets(prev =>
      prev.map(budget => (budget.id === id ? { ...budget, ...data } : budget))
    );
  };

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(budget => budget.id !== id));
  };

  const updateSpent = (category: string, amount: number) => {
    setBudgets(prev =>
      prev.map(budget =>
        budget.category === category
          ? { ...budget, spent: Math.max(0, budget.spent + amount) }
          : budget
      )
    );
  };

  return (
    <BudgetsContext.Provider value={{ budgets, addBudget, updateBudget, deleteBudget, updateSpent, isLoading }}>
      {children}
    </BudgetsContext.Provider>
  );
}

export function useBudgets() {
  const context = React.useContext(BudgetsContext);
  if (context === undefined) {
    throw new Error("useBudgets must be used within a BudgetsProvider");
  }
  return context;
} 