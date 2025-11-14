import { $fetch } from '@/lib/fetch';

import {
  AprovarOfertaParamsType,
  CreateOfertaType,
  EditOfertaType,
  OfertaPaginationParamsType,
  OfertaType,
  PaginatedOfertaType,
  RejeitarOfertaParamsType,
} from '@/schemas/oferta.schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { OldMutationParams } from '.';

export const ofertaKeys = {
  all: ['ofertas'] as const,
  lists: () => [...ofertaKeys.all, 'lists'] as const,
  list: (params?: OfertaPaginationParamsType) =>
    [...ofertaKeys.lists(), params] as const,
  details: () => [...ofertaKeys.all, 'detail'] as const,
  detail: (id?: number) => [...ofertaKeys.details(), id] as const,
};

export function useOfertas(params?: OfertaPaginationParamsType) {
  return useQuery<PaginatedOfertaType>({
    queryKey: ofertaKeys.list(params),
    queryFn: () =>
      $fetch('/ofertas', {
        query: params,
      }),
  });
}

export function useMinhasOfertas(params?: OfertaPaginationParamsType) {
  return useQuery<PaginatedOfertaType>({
    queryKey: ofertaKeys.list(params),
    queryFn: () =>
      $fetch('/ofertas/minhas', {
        query: params,
      }),
  });
}

export function useOferta(id?: number) {
  return useQuery<OfertaType>({
    queryKey: ofertaKeys.detail(id),
    enabled: !!id,
    queryFn: () => $fetch('/ofertas/:id', { params: { id: id as number } }),
  });
}

export function useCreateOfertaMutation(
  param?: OldMutationParams<OfertaType, CreateOfertaType>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOfertaType) => {
      return await $fetch('@post/ofertas', {
        body: data,
      });
    },

    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ofertaKeys.lists() });
      param?.onSuccess?.(data, variables);
      toast.success('Oferta criada com sucesso');
    },

    onError: (error) => {
      param?.onError?.(error);
      toast.error('Erro ao criar oferta');
    },
  });
}

export function useUpdateOfertaMutation(
  param?: OldMutationParams<OfertaType, { id: number; data: EditOfertaType }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: number; data: EditOfertaType }) => {
      return await $fetch(`@put/ofertas/:id`, {
        params: { id: params.id },
        body: params.data,
      });
    },

    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ofertaKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: ofertaKeys.detail(variables.id),
      });
      param?.onSuccess?.(data, variables);
      toast.success('Oferta atualizada com sucesso');
    },

    onError: (error) => {
      param?.onError?.(error);
      toast.error('Erro ao atualizar oferta');
    },
  });
}

export function useDeleteOfertaMutation(
  param?: OldMutationParams<Record<string, never>, number>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      $fetch('@delete/ofertas/:id', { params: { id } }),

    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ofertaKeys.lists() });
      queryClient.removeQueries({
        queryKey: ofertaKeys.detail(variables),
      });
      param?.onSuccess?.(data, variables);
      toast.success('Oferta excluída com sucesso');
    },

    onError: (error) => {
      param?.onError?.(error);
      toast.error('Erro ao excluir oferta');
    },
  });
}

export function useAprovarOfertaMutation(
  param?: OldMutationParams<OfertaType, AprovarOfertaParamsType>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: AprovarOfertaParamsType) =>
      $fetch('@post/ofertas/:id/aprovar', {
        params: { id: params.id },
      }),

    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ofertaKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: ofertaKeys.detail(variables.id),
      });
      param?.onSuccess?.(data, variables);
      toast.success('Oferta aprovada com sucesso');
    },

    onError: (error) => {
      param?.onError?.(error);
      toast.error('Erro ao aprovar oferta');
    },
  });
}

export function useRejeitarOfertaMutation(
  param?: OldMutationParams<OfertaType, RejeitarOfertaParamsType>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: RejeitarOfertaParamsType) =>
      $fetch('@post/ofertas/:id/rejeitar', {
        params: { id: params.id },
        query: {
          motivo: params.motivo,
        },
      }),

    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ofertaKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: ofertaKeys.detail(variables.id),
      });
      param?.onSuccess?.(data, variables);
      toast.success('Oferta rejeitada com sucesso');
    },

    onError: (error) => {
      param?.onError?.(error);
      toast.error('Erro ao rejeitar oferta');
    },
  });
}
