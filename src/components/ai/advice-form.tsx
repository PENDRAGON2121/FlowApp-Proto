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
import { Textarea } from "@/components/ui/textarea";
import { Brain } from "lucide-react";

const adviceFormSchema = z.object({
  transactionHistory: z.string().min(50, { message: "Please provide at least 50 characters of transaction history." }),
});

export type AdviceFormValues = z.infer<typeof adviceFormSchema>;

interface AdviceFormProps {
  onSubmit: (data: AdviceFormValues) => Promise<void>;
  isLoading: boolean;
}

// Sample transaction history
const sampleHistory = `July 15: Groceries - $55.20 (Food)
July 14: Salary - $2500.00 (Income)
July 13: Netflix - $15.00 (Entertainment)
July 12: Gas - $40.00 (Transport)
July 11: Coffee - $5.50 (Food)
July 10: Movie Tickets - $30.00 (Entertainment)
July 09: Dinner Out - $65.00 (Food)
July 08: Bus Pass - $60.00 (Transport)
July 07: Pharmacy - $22.30 (Health)
July 06: Book - $18.99 (Shopping)
July 05: Lunch - $12.75 (Food)
July 04: Concert Ticket - $85.00 (Entertainment)
July 03: Internet Bill - $70.00 (Utilities)
July 02: Clothing - $120.45 (Shopping)
July 01: Rent - $1200.00 (Housing)`;


export function AdviceForm({ onSubmit, isLoading }: AdviceFormProps) {
  const form = useForm<AdviceFormValues>({
    resolver: zodResolver(adviceFormSchema),
    defaultValues: {
      transactionHistory: "",
    },
  });

  const setSampleData = () => {
    form.setValue("transactionHistory", sampleHistory);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="transactionHistory"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Your Transaction History</FormLabel>
                <Button type="button" variant="link" size="sm" onClick={setSampleData} className="p-0 h-auto text-primary">
                  Use Sample Data
                </Button>
              </div>
              <FormControl>
                <Textarea
                  placeholder="Paste your transaction history here, or describe your spending patterns. For example: 'Spent $200 on groceries, $100 on gas, $50 on entertainment last month...'"
                  {...field}
                  rows={10}
                  className="bg-background"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
          <Brain className="mr-2 h-4 w-4" />
          {isLoading ? "Getting Advice..." : "Get Financial Advice"}
        </Button>
      </form>
    </Form>
  );
}
