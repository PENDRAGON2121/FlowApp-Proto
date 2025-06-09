"use client";

import * as React from "react";
import { AdviceForm, type AdviceFormValues } from "@/components/ai/advice-form";
import { AdviceDisplay } from "@/components/ai/advice-display";
import { getFinancialAdvice, type GetFinancialAdviceOutput } from "@/ai/flows/get-financial-advice";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default function AiAdvicePage() {
  const [advice, setAdvice] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleGetAdvice = async (data: AdviceFormValues) => {
    setIsLoading(true);
    setError(null);
    setAdvice(null);
    try {
      const result: GetFinancialAdviceOutput = await getFinancialAdvice({
        transactionHistory: data.transactionHistory,
      });
      setAdvice(result.advice);
    } catch (err) {
      console.error("Error getting financial advice:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to get advice: ${errorMessage}`);
      toast({
        title: "Error",
        description: `Could not fetch advice. ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <Sparkles className="mx-auto h-12 w-12 text-accent mb-2" />
        <h2 className="text-3xl font-bold tracking-tight font-headline">AI Financial Advisor</h2>
        <p className="text-muted-foreground mt-1">
          Get personalized suggestions on how to reduce costs based on your spending habits.
        </p>
      </div>
      
      <AdviceForm onSubmit={handleGetAdvice} isLoading={isLoading} />

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <AdviceDisplay advice={advice} />
    </div>
  );
}
