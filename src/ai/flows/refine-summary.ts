'use server';
/**
 * @fileOverview This file defines a Genkit flow for refining a note summary using AI.
 *
 * refineSummary - A function that refines the summary of a note using AI.
 * RefineSummaryInput - The input type for the refineSummary function.
 * RefineSummaryOutput - The return type for the refineSummary function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const RefineSummaryInputSchema = z.object({
  originalNote: z.string().describe('The original content of the note.'),
  currentSummary: z.string().describe('The current summary of the note.'),
});
export type RefineSummaryInput = z.infer<typeof RefineSummaryInputSchema>;

const RefineSummaryOutputSchema = z.object({
  refinedSummary: z.string().describe('The refined summary of the note.'),
});
export type RefineSummaryOutput = z.infer<typeof RefineSummaryOutputSchema>;

export async function refineSummary(input: RefineSummaryInput): Promise<RefineSummaryOutput> {
  return refineSummaryFlow(input);
}

const refineSummaryPrompt = ai.definePrompt({
  name: 'refineSummaryPrompt',
  input: {
    schema: z.object({
      originalNote: z.string().describe('The original content of the note.'),
      currentSummary: z.string().describe('The current summary of the note.'),
    }),
  },
  output: {
    schema: z.object({
      refinedSummary: z.string().describe('The refined summary of the note.'),
    }),
  },
  prompt: `You are an AI expert in creating concise and accurate summaries.

  Please refine the existing summary of a note, taking into account the original note content.
  The refined summary should be clear, concise, and capture the main points of the original note.

  Original Note: {{{originalNote}}}
  Current Summary: {{{currentSummary}}}

  Refined Summary:`,
});

const refineSummaryFlow = ai.defineFlow<
  typeof RefineSummaryInputSchema,
  typeof RefineSummaryOutputSchema
>(
  {
    name: 'refineSummaryFlow',
    inputSchema: RefineSummaryInputSchema,
    outputSchema: RefineSummaryOutputSchema,
  },
  async input => {
    const {output} = await refineSummaryPrompt(input);
    return output!;
  }
);
