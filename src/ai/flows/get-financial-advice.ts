'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing AI-powered financial advice to users,
 * incorporating their past transaction history.
 *
 * - getFinancialAdvice - A function that calls the flow.
 * - GetFinancialAdviceInput - The input type for the getFinancialAdvice function.
 * - GetFinancialAdviceOutput - The return type for the getFinancialAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetFinancialAdviceInputSchema = z.object({
  transactionHistory: z
    .string()
    .describe('The user transaction history.'),
});
export type GetFinancialAdviceInput = z.infer<typeof GetFinancialAdviceInputSchema>;

const GetFinancialAdviceOutputSchema = z.object({
  advice: z.string().describe('AI-powered advice on how to reduce costs.'),
});
export type GetFinancialAdviceOutput = z.infer<typeof GetFinancialAdviceOutputSchema>;

export async function getFinancialAdvice(input: GetFinancialAdviceInput): Promise<GetFinancialAdviceOutput> {
  return getFinancialAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getFinancialAdvicePrompt',
  input: {schema: GetFinancialAdviceInputSchema},
  output: {schema: GetFinancialAdviceOutputSchema},
  prompt: `You are a personal finance expert. Based on the user's transaction history, provide advice on how to reduce costs.

Transaction History: {{{transactionHistory}}}`,
});

const getFinancialAdviceFlow = ai.defineFlow(
  {
    name: 'getFinancialAdviceFlow',
    inputSchema: GetFinancialAdviceInputSchema,
    outputSchema: GetFinancialAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
