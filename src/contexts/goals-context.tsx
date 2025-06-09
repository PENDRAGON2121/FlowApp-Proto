"use client";

import type { SavingsGoalFormValues } from "@/components/savings/savings-goal-form";
import * as React from "react";

// Define la interfaz Goal basada en el formulario
export interface Goal extends SavingsGoalFormValues {
  id: string;
}

// Datos iniciales de ejemplo
const initialMockGoalsData: Goal[] = [
  {
    id: '1',
    name: 'Nuevo Carro',
    targetAmount: 15000,
    currentAmount: 5000,
    deadline: new Date('2024-12-31'),
  },
  {
    id: '2',
    name: 'Vacaciones',
    targetAmount: 3000,
    currentAmount: 1000,
    deadline: new Date('2024-08-15'),
  },
];

interface GoalsContextType {
  goals: Goal[];
  addGoal: (data: SavingsGoalFormValues) => void;
  updateGoal: (id: string, data: SavingsGoalFormValues) => void;
  deleteGoal: (id: string) => void;
  isLoading: boolean;
}

const GoalsContext = React.createContext<GoalsContextType | undefined>(undefined);

const STORAGE_KEY = 'savings-goals';

export function GoalsProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = React.useState<Goal[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Cargar datos del localStorage al iniciar
  React.useEffect(() => {
    try {
      const storedGoals = localStorage.getItem(STORAGE_KEY);
      if (storedGoals) {
        const parsedGoals = JSON.parse(storedGoals).map((goal: any) => ({
          ...goal,
          deadline: goal.deadline ? new Date(goal.deadline) : undefined
        }));
        setGoals(parsedGoals);
      } else {
        setGoals(initialMockGoalsData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockGoalsData));
      }
    } catch (error) {
      console.error('Error loading goals from localStorage:', error);
      setGoals(initialMockGoalsData);
    }
    setIsLoading(false);
  }, []);

  // Guardar en localStorage cada vez que goals cambie
  React.useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    }
  }, [goals, isLoading]);

  const addGoal = (data: SavingsGoalFormValues) => {
    const newGoal: Goal = { ...data, id: Date.now().toString() };
    setGoals(prev => [newGoal, ...prev]);
  };

  const updateGoal = (id: string, data: SavingsGoalFormValues) => {
    setGoals(prev =>
      prev.map(goal => (goal.id === id ? { ...goal, ...data } : goal))
    );
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  return (
    <GoalsContext.Provider value={{ goals, addGoal, updateGoal, deleteGoal, isLoading }}>
      {children}
    </GoalsContext.Provider>
  );
}

export function useGoals() {
  const context = React.useContext(GoalsContext);
  if (context === undefined) {
    throw new Error("useGoals must be used within a GoalsProvider");
  }
  return context;
} 