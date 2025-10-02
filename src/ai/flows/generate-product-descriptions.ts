'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating product descriptions using AI.
 *
 * The flow takes product details as input and returns a generated product description.
 * It includes:
 *   - generateProductDescription: An async function that takes ProductDetailsInput as input and returns a string description.
 *   - ProductDetailsInput: A Zod schema defining the input structure for product details.
 *   - GeneratedDescription: A Zod schema defining the structure for the output description.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for product details
const ProductDetailsInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productFeatures: z.array(z.string()).describe('An array of key features of the product.'),
  productTags: z.array(z.string()).describe('An array of tags associated with the product.'),
  productMetadata: z.record(z.string(), z.any()).optional().describe('Additional metadata about the product, such as brand, model, or dimensions.'),
  marketTrends: z.string().optional().describe('Current market trends related to the product.'),
});

export type ProductDetailsInput = z.infer<typeof ProductDetailsInputSchema>;

// Define the output schema for the generated description
const GeneratedDescriptionSchema = z.object({
  description: z.string().describe('The generated product description.'),
});

export type GeneratedDescription = z.infer<typeof GeneratedDescriptionSchema>;

// Exported function to generate the product description
export async function generateProductDescription(input: ProductDetailsInput): Promise<GeneratedDescription> {
  return generateProductDescriptionFlow(input);
}

// Define the prompt for generating the product description
const productDescriptionPrompt = ai.definePrompt({
  name: 'productDescriptionPrompt',
  input: {schema: ProductDetailsInputSchema},
  output: {schema: GeneratedDescriptionSchema},
  prompt: `You are an AI assistant specialized in creating compelling product descriptions. Based on the following information, generate a product description that highlights the key features and benefits.

Product Name: {{productName}}
Features: {{#each productFeatures}}{{{this}}}, {{/each}}
Tags: {{#each productTags}}{{{this}}}, {{/each}}
{{#if productMetadata}}
Metadata: {{JSONstringify productMetadata}}
{{/if}}
{{#if marketTrends}}
Market Trends: {{marketTrends}}
{{/if}}

Write a concise and engaging product description. Focus on how these features benefit the customer and why they should purchase this product.`,
});

// Define the Genkit flow for generating product descriptions
const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: ProductDetailsInputSchema,
    outputSchema: GeneratedDescriptionSchema,
  },
  async input => {
    const {output} = await productDescriptionPrompt(input);
    return output!;
  }
);
