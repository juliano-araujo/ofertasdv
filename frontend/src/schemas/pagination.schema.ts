import * as z from 'zod';

// Spring Boot Sort schema
export const sortSchema = z.object({
  empty: z.boolean(),
  sorted: z.boolean(),
  unsorted: z.boolean(),
});

// Spring Boot Pageable schema
export const pageableSchema = z.object({
  pageNumber: z.number(),
  pageSize: z.number(),
  sort: sortSchema,
  offset: z.number(),
  paged: z.boolean(),
  unpaged: z.boolean(),
});

// Generic Spring Boot Page response schema
export const createPageSchema = <T extends z.ZodTypeAny>(contentSchema: T) =>
  z.object({
    content: z.array(contentSchema),
    pageable: pageableSchema,
    totalPages: z.number(),
    totalElements: z.number(),
    last: z.boolean(),
    size: z.number(),
    number: z.number(),
    sort: sortSchema,
    numberOfElements: z.number(),
    first: z.boolean(),
    empty: z.boolean(),
  });

// Types
export type SortType = z.infer<typeof sortSchema>;
export type PageableType = z.infer<typeof pageableSchema>;
