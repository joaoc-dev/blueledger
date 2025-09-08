import { google } from '@ai-sdk/google';
import { embed } from 'ai';

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
