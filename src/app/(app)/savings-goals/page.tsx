"use client";

import * as React from "react";
import { PlusCircle, Goal as GoalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SavingsGoalForm, type SavingsGoalFormValues } from "@/components/savings/savings-goal-form";
import { SavingsGoalProgressCard } from "@/components/savings/savings-goal-progress-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"; // For "Add Funds" modal
import { Label } from "@/components/ui/label"; // For "Add Funds" modal
import { useToast } from "@/hooks/use-toast";

interface SavingsGoal extends SavingsGoalFormValues {
  id: string;
}

const mockSavingsGoalsData: SavingsGoal[] = [
  { id: '1', name: 'Dream Vacation to Japan', targetAmount: 5000, currentAmount: 1250, deadline: new Date('2025-08-15') },
  { id: '2', name: 'New MacBook Pro', targetAmount: 2500, currentAmount: 2500, deadline: new Date('2024-10-01') },
  { id: '3', name: 'Emergency Fund Tier 1', targetAmount: 1000, currentAmount: 700 },
  { id: '4', name: 'House Down Payment', targetAmount: 50000, currentAmount: 5500, deadline: new Date('2027-01-01') },
];

export default function SavingsGoalsPage() {
  const [goals, setGoals] = React.useState<SavingsGoal[]>(mockSavingsGoalsData);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingGoal, setEditingGoal] = React.useState<SavingsGoal | undefined>(undefined);
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = React.useState(false);
  const [selectedGoalForFunds, setSelectedGoalForFunds] = React.useState<SavingsGoal | null>(null);
  const [fundsToAdd, setFundsToAdd] = React.useState<number>(0);
  const { toast } = useToast();

  const handleSubmitGoal = async (data: SavingsGoalFormValues) => {
    if (editingGoal) {
      setGoals(prev => prev.map(g => g.id === editingGoal.id ? { ...editingGoal, ...data } : g));
    } else {
      const newGoal: SavingsGoal = { ...data, id: Date.now().toString(), currentAmount: data.currentAmount || 0 };
      setGoals(prev => [newGoal, ...prev]);
    }
    setIsFormOpen(false);
    setEditingGoal(undefined);
  };

  const handleEditGoal = (id: string) => {
    const goalToEdit = goals.find(g => g.id === id);
    if (goalToEdit) {
      setEditingGoal(goalToEdit);
      setIsFormOpen(true);
    }
  };

  const handleDeleteGoal = (id: string) => {
    // Add confirmation dialog in real app
    setGoals(prev => prev.filter(g => g.id !== id));
    toast({ title: "Savings Goal Deleted", description: "The goal has been removed."});
  };

  const openNewGoalForm = () => {
    setEditingGoal(undefined);
    setIsFormOpen(true);
  }

  const openAddFundsModal = (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (goal) {
      setSelectedGoalForFunds(goal);
      setFundsToAdd(0);
      setIsAddFundsModalOpen(true);
    }
  };

  const handleAddFunds = () => {
    if (!selectedGoalForFunds || fundsToAdd <= 0) return;
    setGoals(prevGoals => prevGoals.map(g => 
      g.id === selectedGoalForFunds.id 
      ? { ...g, currentAmount: Math.min(g.targetAmount, (g.currentAmount || 0) + fundsToAdd) } 
      : g
    ));
    toast({ title: "Funds Added", description: `$${fundsToAdd.toFixed(2)} added to "${selectedGoalForFunds.name}".` });
    setIsAddFundsModalOpen(false);
    setSelectedGoalForFunds(null);
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Savings Goals</h2>
          <p className="text-muted-foreground">Set and track your financial milestones.</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) setEditingGoal(undefined);
          }}>
          <DialogTrigger asChild>
            <Button onClick={openNewGoalForm} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingGoal ? "Edit Savings Goal" : "Create New Savings Goal"}</DialogTitle>
            </DialogHeader>
            <SavingsGoalForm
              onSubmit={handleSubmitGoal}
              initialData={editingGoal}
              onClose={() => { setIsFormOpen(false); setEditingGoal(undefined); }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {goals.length === 0 ? (
         <div className="text-center py-12">
          <GoalIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-medium">No Savings Goals Yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Start planning for your future by creating your first savings goal.
          </p>
          <Button onClick={openNewGoalForm} className="mt-4 bg-primary hover:bg-primary/90">
            Create First Goal
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <SavingsGoalProgressCard
              key={goal.id}
              {...goal}
              currentAmount={goal.currentAmount || 0}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
              onAddFunds={openAddFundsModal}
            />
          ))}
        </div>
      )}

      {/* Add Funds Modal */}
      <Dialog open={isAddFundsModalOpen} onOpenChange={setIsAddFundsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Funds to "{selectedGoalForFunds?.name}"</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="funds-amount" className="text-right col-span-1">
                Amount
              </Label>
              <Input
                id="funds-amount"
                type="number"
                value={fundsToAdd}
                onChange={(e) => setFundsToAdd(parseFloat(e.target.value) || 0)}
                className="col-span-3 bg-background"
                placeholder="0.00"
              />
            </div>
             <p className="text-sm text-muted-foreground col-span-4 px-1">
                Current: ${selectedGoalForFunds?.currentAmount?.toLocaleString() || 0} / Target: ${selectedGoalForFunds?.targetAmount.toLocaleString()}
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAddFundsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddFunds} className="bg-primary hover:bg-primary/90">Add Funds</Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
