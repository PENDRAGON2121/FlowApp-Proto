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
import { CategorySelector } from "@/components/transactions/category-selector"; // Re-use category selector
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const budgetFormSchema = z.object({
  category: z.string().min(1, { message: "Category is required." }),
  amount: z.coerce.number().positive({ message: "Budget amount must be positive." }),
  month: z.string().min(1, { message: "Month is required." }), // e.g., "2024-07"
  year: z.string().min(4, {message: "Year is required."}),
});

export type BudgetFormValues = z.infer<typeof budgetFormSchema>;

interface BudgetFormProps {
  onSubmit: (data: BudgetFormValues) => Promise<void> | void;
  initialData?: Partial<BudgetFormValues>;
  onClose?: () => void;
  existingCategoriesForBudgets?: string[]; // To disable already budgeted categories for the selected month/year
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());
const months = [
  { value: "01", label: "January" }, { value: "02", label: "February" },
  { value: "03", label: "March" }, { value: "04",label: "April" },
  { value: "05", label: "May" }, { value: "06", label: "June" },
  { value: "07", label: "July" }, { value: "08", label: "August" },
  { value: "09", label: "September" }, { value: "10", label: "October" },
  { value: "11", label: "November" }, { value: "12", label: "December" },
];


export function BudgetForm({ onSubmit, initialData, onClose, existingCategoriesForBudgets = [] }: BudgetFormProps) {
  const { toast } = useToast();
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: initialData || {
      category: "",
      amount: 0,
      month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
      year: new Date().getFullYear().toString(),
    },
  });

  const handleSubmit = async (data: BudgetFormValues) => {
    await onSubmit(data);
    toast({
      title: initialData?.category ? "Budget Updated" : "Budget Set",
      description: `Budget for ${categoryMap[data.category] || data.category} set to $${data.amount.toFixed(2)} for ${months.find(m=>m.value === data.month)?.label} ${data.year}.`,
    });
    if (!initialData?.category) form.reset({
      month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
      year: new Date().getFullYear().toString(),
      category: "",
      amount: 0,
    });
    if (onClose) onClose();
  };
  
  const categoryMap: Record<string, string> = {
    food: "Food & Dining", transport: "Transportation", housing: "Housing",
    utilities: "Utilities", entertainment: "Entertainment", health: "Healthcare",
    education: "Education", shopping: "Shopping", other: "Other",
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Month</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {months.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                  transactionType="expense" // Budgets are typically for expenses
                />
                 {/* Add a check here to ensure category is not in existingCategoriesForBudgets if editing is disabled for that */}
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
                <Input type="number" placeholder="500.00" {...field} step="0.01" className="bg-background"/>
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
