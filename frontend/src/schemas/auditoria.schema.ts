import { z } from 'zod';

export const AuditoriaSchema = z.object({
  id: z.number().int().positive().nullish(),
  usuarioId: z.number().int().positive(),
  acao: z.string().min(1),
  descricao: z.string().nullish(),
  dataAcao: z.date(),
  detalhes: z.record(z.string(), z.unknown()).nullish(),
});

export type Auditoria = z.infer<typeof AuditoriaSchema>;
