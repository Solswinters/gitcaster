/**
 * API request validators
 */

import { z } from 'zod';

/**
 * validateRequest utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of validateRequest.
 */
export const validateRequest = <T>(schema: z.Schema<T>, data: unknown): T => {
  return schema.parse(data);
};

/**
 * validateRequestSafe utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of validateRequestSafe.
 */
export const validateRequestSafe = <T>(
  schema: z.Schema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } => {
  const result = schema.safeParse(data);
  return result;
};

/**
 * paginationSchema utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of paginationSchema.
 */
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

/**
 * idParamSchema utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of idParamSchema.
 */
export const idParamSchema = z.object({
  id: z.string().min(1),
});

/**
 * usernameParamSchema utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of usernameParamSchema.
 */
export const usernameParamSchema = z.object({
  username: z.string().min(1),
});

/**
 * searchQuerySchema utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of searchQuerySchema.
 */
export const searchQuerySchema = z.object({
  q: z.string().min(1),
  filters: z.record(z.any()).optional(),
  ...paginationSchema.shape,
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

