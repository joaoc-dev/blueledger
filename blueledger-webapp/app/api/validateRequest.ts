import { NextResponse } from 'next/server';
import { z } from 'zod';

export function validateRequest<S extends z.ZodTypeAny>(
  schema: S,
  data: unknown
): {
  error: NextResponse | null;
  data: z.infer<S> | null;
} {
  const validation = schema.safeParse(data);

  if (!validation.success) {
    return {
      error: NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      ),
      data: null,
    };
  }

  return {
    error: null,
    data: validation.data,
  };
}
