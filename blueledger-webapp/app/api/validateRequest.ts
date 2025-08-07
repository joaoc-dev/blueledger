import type { z } from 'zod';
import { NextResponse } from 'next/server';

type ValidationResult<T extends z.ZodTypeAny>
  = | { success: true; data: z.infer<T> }
    | { success: false; error: NextResponse };

export function validateRequest<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
): ValidationResult<T> {
  try {
    const validation = schema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        error: NextResponse.json(
          {
            error: 'Error validating schema',
            details: validation.error.errors.map(e => ({
              field: e.path.join('.'),
              message: e.message,
            })),
          },
          { status: 400 },
        ),
      };
    }

    return {
      success: true,
      data: validation.data,
    };
  }
  catch (error) {
    console.error('Error validating request', error);
    return {
      success: false,
      error: NextResponse.json(
        { error: 'Internal validation error' },
        { status: 500 },
      ),
    };
  }
}
