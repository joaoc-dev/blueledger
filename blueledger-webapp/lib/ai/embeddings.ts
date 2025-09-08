import { google } from '@ai-sdk/google';
import { embed, embedMany } from 'ai';

/**
 * Generate a vector embedding for a given text value using Gemini embeddings.
 * Returns an empty array if the input is empty.
 */
export async function generateTextEmbedding(value: string): Promise<number[]> {
  const text = (value ?? '').trim();
  if (!text)
    return [];

  const embeddingModel = google.textEmbeddingModel('gemini-embedding-001');
  const response = await embed({ model: embeddingModel, value: text });
  return response.embedding ?? [];
}

/**
 * Batch-generate vector embeddings for an array of texts using Gemini embeddings.
 * - Skips empty inputs by returning empty vectors for those positions.
 * - Intentionally keeps batch sizes small and can be rate-limited by caller.
 */
export async function generateTextEmbeddings(values: string[]): Promise<number[][]> {
  const trimmed = values.map(v => (v ?? '').trim());
  if (trimmed.length === 0)
    return [];

  const embeddingModel = google.textEmbeddingModel('gemini-embedding-001');
  const response = await embedMany({ model: embeddingModel, values: trimmed });
  // Map missing/empty back to [] for consistent downstream handling
  return (response.embeddings ?? trimmed.map(() => [])) as number[][];
}
