import * as z from 'zod';
import { createPageSchema } from './pagination.schema';

export const statusEnum = z.enum(['PENDENTE', 'APROVADO', 'REJEITADO']);
export type Status = z.infer<typeof statusEnum>;

export const baseOfertaSchema = z.object({
  nomeProduto: z.string().min(1),
  preco: z.number().positive(),
  quantidade: z.number().int().nonnegative(),
  descricao: z.string().max(1000),
});

export const createOfertaSchema = baseOfertaSchema;
export type CreateOfertaType = z.infer<typeof createOfertaSchema>;

export const editOfertaSchema = baseOfertaSchema;
export type EditOfertaType = z.infer<typeof editOfertaSchema>;

export const ofertaSchema = z.object({
  id: z.number().int().positive(),
  ...baseOfertaSchema.shape,
  status: statusEnum,
  dataCriacao: z.coerce.date(),
  fotoUrl: z.url().nullish(),
  comercianteNome: z.string(),
  administradorNome: z.string().nullable(),
});
export type OfertaType = z.infer<typeof ofertaSchema>;

export const ofertaItemSchema = z.object({
  ...ofertaSchema.shape,
  fotoUrl: z.url().nullish(),
});

export const ofertaListSchema = ofertaItemSchema.array();
export type OfertaListType = z.infer<typeof ofertaListSchema>;

export const ofertaPaginationParamsSchema = z.object({
  nome: z.string().optional(),
  page: z.number().int().nonnegative().default(0),
  size: z.number().int().positive().default(10),
});
export type OfertaPaginationParamsType = z.infer<
  typeof ofertaPaginationParamsSchema
>;

export const paginatedOfertaSchema = createPageSchema(ofertaSchema);
export type PaginatedOfertaType = z.infer<typeof paginatedOfertaSchema>;

export const aprovarOfertaParamsSchema = z.object({
  id: z.number().int().positive(),
});
export type AprovarOfertaParamsType = z.infer<typeof aprovarOfertaParamsSchema>;

export const rejeitarOfertaParamsSchema = z.object({
  id: z.number().int().positive(),
  motivo: z.string().optional(),
});
export type RejeitarOfertaParamsType = z.infer<
  typeof rejeitarOfertaParamsSchema
>;

export const idParamsSchema = z.object({
  id: z.number().int().positive(),
});

export const emptyResponseSchema = z.object({});
