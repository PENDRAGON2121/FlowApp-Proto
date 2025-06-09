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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const savingsGoalFormSchema = z.object({
  name: z.string().min(1, { message: "Goal name is required." }),
  targetAmount: z.coerce.number().positive({ message: "Target amount must be positive." }),
  currentAmount: z.coerce.number().min(0, { message: "Current amount cannot be negative." }).optional(),
  deadline: z.date().optional(),
}).refine(data => !data.currentAmount || data.currentAmount <= data.targetAmount, {
  message: "Current amount cannot exceed target amount.",
  path: ["currentAmount"],
});

export type SavingsGoalFormValues = z.infer<typeof savingsGoalFormSchema>;

interface SavingsGoalFormProps {
  onSubmit: (data: SavingsGoalFormValues) => Promise<void> | void;
  initialData?: Partial<SavingsGoalFormValues>;
  onClose?: () => void;
}

export function SavingsGoalForm({ onSubmit, initialData, onClose }: SavingsGoalFormProps) {
  const { toast } = useToast();
  const form = useForm<SavingsGoalFormValues>({
    resolver: zodResolver(savingsGoalFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      currentAmount: initialData.currentAmount ?? 0,
    } : {
      name: "",
      targetAmount: 0,
      currentAmount: 0,
      deadline: undefined,
    },
  });

  const handleSubmit = async (data: SavingsGoalFormValues) => {
    await onSubmit(data);
    toast({
      title: initialData?.name ? "Savings Goal Updated" : "Savings Goal Created",
      description: `Goal "${data.name}" for $${data.targetAmount.toFixed(2)}`,
    });
     if (!initialData?.name) form.reset();
    if (onClose) onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., New Car, Vacation" {...field} className="bg-background"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="1000.00" {...field} step="0.01" className="bg-background"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="currentAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Amount Saved (Optional)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00" {...field} step="0.01" className="bg-background"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Deadline (Optional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal bg-background",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1)) } // disable past dates
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          {onClose && <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>}
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            {initialData?.name ? "Update Goal" : "Create Goal"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
