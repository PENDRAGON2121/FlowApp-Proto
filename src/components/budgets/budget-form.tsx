"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CategorySelector } from "@/components/transactions/category-selector";
import { useToast } from "@/hooks/use-toast";

const budgetFormSchema = z.object({
  category: z.string().min(1, { message: "Category is required." }),
  amount: z.coerce.number().positive({ message: "Budget amount must be positive." }),
});

export type BudgetFormValues = z.infer<typeof budgetFormSchema> & {
  id?: string;
};

interface BudgetFormProps {
  onSubmit: (data: BudgetFormValues) => Promise<void> | void;
  initialData?: Partial<BudgetFormValues>;
  onClose?: () => void;
  existingCategoriesForBudgets?: string[];
}

export function BudgetForm({ onSubmit, initialData, onClose, existingCategoriesForBudgets = [] }: BudgetFormProps) {
  const { toast } = useToast();
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      category: initialData?.category || "",
      amount: initialData?.amount || 0,
    },
  });

  const handleSubmit = async (data: BudgetFormValues) => {
    await onSubmit(data);
    toast({
      title: initialData?.category ? "Budget Updated" : "Budget Set",
      description: `Budget for ${categoryMap[data.category] || data.category} set to $${data.amount.toFixed(2)}.`,
    });
    if (!initialData?.category) {
      form.reset({
        category: "",
        amount: 0,
      });
    }
    if (onClose) onClose();
  };
  
  const categoryMap: Record<string, string> = {
    food: "Food & Dining",
    transport: "Transportation",
    housing: "Housing",
    utilities: "Utilities",
    entertainment: "Entertainment",
    health: "Healthcare",
    education: "Education",
    shopping: "Shopping",
    other: "Other",
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <CategorySelector
                  value={field.value}
                  onChange={field.onChange}
                  transactionType="expense"
                  disabledCategories={existingCategoriesForBudgets}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Amount</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="500.00" 
                  {...field}
                  value={field.value || ""}
                  step="0.01" 
                  className="bg-background"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          {onClose && <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>}
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            {initialData?.category ? "Update Budget" : "Set Budget"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
