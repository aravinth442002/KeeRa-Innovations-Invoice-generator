'use server';
/**
 * @fileOverview Extracts invoice details from an image using AI.
 *
 * - extractInvoiceDetailsFromImage - Extracts invoice details from an image.
 * - ExtractInvoiceDetailsFromImageInput - The input type for the extractInvoiceDetailsFromImage function.
 * - ExtractInvoiceDetailsFromImageOutput - The return type for the extractInvoiceDetailsFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractInvoiceDetailsFromImageInputSchema = z.object({
  invoiceImageDataUri: z
    .string()
    .describe(
      "A photo of an invoice, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type ExtractInvoiceDetailsFromImageInput = z.infer<typeof ExtractInvoiceDetailsFromImageInputSchema>;

const ExtractInvoiceDetailsFromImageOutputSchema = z.object({
  totalAmount: z.string().describe('The total amount due on the invoice.'),
  invoiceNumber: z.string().describe('The invoice number.'),
  dueDate: z.string().describe('The due date of the invoice.'),
  status: z.string().describe('The invoice status (e.g., paid, unpaid).'),
});

export type ExtractInvoiceDetailsFromImageOutput = z.infer<typeof ExtractInvoiceDetailsFromImageOutputSchema>;

export async function extractInvoiceDetailsFromImage(
  input: ExtractInvoiceDetailsFromImageInput
): Promise<ExtractInvoiceDetailsFromImageOutput> {
  return extractInvoiceDetailsFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractInvoiceDetailsFromImagePrompt',
  input: {schema: ExtractInvoiceDetailsFromImageInputSchema},
  output: {schema: ExtractInvoiceDetailsFromImageOutputSchema},
  prompt: `You are an expert AI assistant specialized in extracting key details from invoice images.

  Given an image of an invoice, extract the following information:

  - Total Amount: The total amount due on the invoice.
  - Invoice Number: The invoice number.
  - Due Date: The due date of the invoice.
  - Status: The invoice status (e.g., paid, unpaid).

  Return the extracted information in JSON format.

  Invoice Image: {{media url=invoiceImageDataUri}}
  `,
});

const extractInvoiceDetailsFromImageFlow = ai.defineFlow(
  {
    name: 'extractInvoiceDetailsFromImageFlow',
    inputSchema: ExtractInvoiceDetailsFromImageInputSchema,
    outputSchema: ExtractInvoiceDetailsFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
