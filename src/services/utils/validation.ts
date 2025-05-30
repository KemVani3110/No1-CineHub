import { ZodSchema } from 'zod';

export function validate<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error('Validation failed: ' + JSON.stringify(result.error.issues));
  }
  return result.data;
}
