import { google } from '@ai-sdk/google';
import { embed, embedMany } from 'ai';

// Specific error to signal embedding quota/rate-limit issues upstream
export class EmbeddingQuotaError extends Error {
  constructor(message: string = 'Embedding quota exceeded') {
    super(message);
    this.name = 'EmbeddingQuotaError';
  }
}

/**
 * Generate a vector embedding for a given text value using Gemini embeddings.
 * Returns an empty array if the input is empty.
 */
export async function generateTextEmbedding(value: string): Promise<number[]> {
  const text = (value ?? '').trim();
  if (!text)
    return [];

  const embeddingModel = google.textEmbeddingModel('gemini-embedding-001');
  try {
    const response = await embed({ model: embeddingModel, value: text });
    return response.embedding ?? [];
  }
  catch (error: any) {
    // Detect quota/rate-limit signal from underlying API
    const message = typeof error?.message === 'string' ? error.message : '';
    const status = (error?.statusCode ?? error?.status) as number | undefined;
    const statusText = error?.data?.error?.status as string | undefined;
    if (status === 429 || /quota/i.test(message) || statusText === 'RESOURCE_EXHAUSTED')
      throw new EmbeddingQuotaError();
    throw error;
  }
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
  try {
    const response = await embedMany({ model: embeddingModel, values: trimmed });
    // Map missing/empty back to [] for consistent downstream handling
    return (response.embeddings ?? trimmed.map(() => [])) as number[][];
  }
  catch (error: any) {
    const message = typeof error?.message === 'string' ? error.message : '';
    const status = (error?.statusCode ?? error?.status) as number | undefined;
    const statusText = error?.data?.error?.status as string | undefined;
    if (status === 429 || /quota/i.test(message) || statusText === 'RESOURCE_EXHAUSTED')
      throw new EmbeddingQuotaError();
    throw error;
  }
}
