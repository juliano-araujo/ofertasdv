import { z } from 'zod';

export const PapelEnum = z.enum(['ADMINISTRADOR', 'COMERCIANTE', 'USUARIO']);
export type PapelType = z.infer<typeof PapelEnum>;

export const usuarioDtoSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string().min(1),
  email: z.email(),
  papel: PapelEnum,
  dataCriacao: z.coerce.date(),
});
export type UsuarioDto = z.infer<typeof usuarioDtoSchema>;

export const usuarioCreateDtoSchema = z.object({
  nome: z.string().min(1),
  email: z.email(),
  senha: z.string().min(6),
  papel: PapelEnum,
});
export type UsuarioCreateDto = z.infer<typeof usuarioCreateDtoSchema>;

export const authRequestSchema = z.object({
  email: z.email(),
  senha: z.string().min(6),
});
export type AuthResponse = z.infer<typeof authResponseSchema>;

export const authResponseSchema = z.object({
  user: usuarioDtoSchema,
  token: z.string(),
});
export type AuthRequest = z.infer<typeof authRequestSchema>;
