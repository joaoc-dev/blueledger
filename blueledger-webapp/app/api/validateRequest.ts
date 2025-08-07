import type { z } from 'zod';

type ValidationResult<T extends z.ZodTypeAny>
  = | { success: true; data: z.infer<T> }
    | { success: false; error: {
      error: string;
      details: { field: string; message: string }[];
    }; };

export function validateRequest<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
): ValidationResult<T> {
  try {
    const validation = schema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        error:
          {
            error: 'Error validating schema',
            details: validation.error.errors.map(e => ({
              field: e.path.join('.'),
              message: e.message,
            })),
          },
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
      error: {
        error: 'Internal validation error',
        details: [],
      },
    };
  }
}
