import {
  createOfertaSchema,
  editOfertaSchema,
  emptyResponseSchema,
  idParamsSchema,
  ofertaListSchema,
  ofertaSchema,
  paginatedOfertaSchema,
} from '@/schemas/oferta.schema';
import {
  authRequestSchema,
  authResponseSchema,
  usuarioCreateDtoSchema,
  usuarioDtoSchema,
} from '@/schemas/usuario.schema';
import { createFetch, createSchema } from '@better-fetch/fetch';
import { clearTokens, getToken } from './jwt-storage';

const schema = createSchema({
  '@delete/country-region/:id': {
    params: idParamsSchema,
    output: emptyResponseSchema,
  },
  '/ofertas': {
    output: paginatedOfertaSchema,
  },
  '/ofertas/minhas': {
    output: paginatedOfertaSchema,
  },
  '/ofertas/:id': {
    params: idParamsSchema,
    output: ofertaSchema,
  },
  '@post/ofertas': {
    input: createOfertaSchema,
    output: ofertaSchema,
  },
  '@put/ofertas/:id': {
    params: idParamsSchema,
    input: editOfertaSchema,
    output: ofertaSchema,
  },
  '@delete/ofertas/:id': {
    params: idParamsSchema,
    output: emptyResponseSchema,
  },
  '@post/ofertas/:id/aprovar': {
    params: idParamsSchema,
    output: ofertaSchema,
  },
  '@post/ofertas/:id/rejeitar': {
    params: idParamsSchema,
    output: ofertaSchema,
  },
  '/usuarios': {
    output: usuarioDtoSchema.array(),
  },
  '/usuarios/:id': {
    params: idParamsSchema,
    output: usuarioDtoSchema,
  },
  '/usuarios/me': {
    output: usuarioDtoSchema,
  },
  '@post/auth/login': {
    input: authRequestSchema,
    output: authResponseSchema,
  },
  '@post/auth/register': {
    input: usuarioCreateDtoSchema,
    output: usuarioDtoSchema,
  },
});

// const errorSchema = z.object({
//   message: z.string(),
//   error: z.string(),
//   statusCode: z.string(),
// });
// export type DefaultApiErrorType = z.infer<typeof errorSchema>;

export const $fetch = createFetch({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  throw: true,
  schema,
  // errorSchema,
  onRequest(context) {
    const token = getToken();

    //   // // Add Content-Type for requests with body
    //   // if (context.body && typeof context.body === 'object') {
    //   //   context.headers = {
    //   //     ...context.headers,
    //   //     'Content-Type': 'application/json',
    //   //   };
    //   // }

    //   // // Add Authorization if token exists
    if (token) {
      context.headers.append('Authorization', `Bearer ${token}`);
    }

    return context;
  },
  onResponse(context) {
    if (context.response.status === 401 || context.response.status === 403) {
      // clearTokens();
    }
    return context.response;
  },
});
