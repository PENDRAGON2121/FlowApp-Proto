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

export async function getFinancialAdvice(
  input: GetFinancialAdviceInput
): Promise<GetFinancialAdviceOutput> {
  const apiKey = process.env.APIKEY_OPENROUTER;
  if (!apiKey) throw new Error('APIKEY_OPENROUTER not set in .env');

  const prompt = `Eres un experto en finanzas personales. Basado en el siguiente historial de transacciones, da consejos para reducir costos.\n\nHistorial de transacciones:\n${input.transactionHistory}`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.2-3b-instruct:free',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.statusText}`);
  }

  const data = await response.json();
  // La respuesta viene en Markdown, así que la devolvemos como tal
  const advice = data.choices?.[0]?.message?.content
    ? data.choices[0].message.content.trim()
    : 'No se pudo obtener el consejo.';

  // Puedes devolver el markdown directamente, y renderizarlo en el frontend con un parser de Markdown
  return { advice };
}