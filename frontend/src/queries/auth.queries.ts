import { $fetch } from '@/lib/fetch';
import { saveToken } from '@/lib/jwt-storage';
import {
  AuthRequest,
  AuthResponse,
  UsuarioCreateDto,
  UsuarioDto,
} from '@/schemas/usuario.schema';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { OldMutationParams } from '.';

export function useLoginMutation(
  param?: OldMutationParams<AuthResponse, AuthRequest>,
) {
  return useMutation({
    mutationFn: async (credentials: AuthRequest) => {
      return await $fetch('@post/auth/login', {
        body: credentials,
      });
    },

    onSuccess: async (data, variables) => {
      saveToken(data.token);
      param?.onSuccess?.(data, variables);
      toast.success('Login realizado com sucesso');
    },

    onError: (error) => {
      param?.onError?.(error);
      toast.error('Erro ao fazer login');
    },
  });
}

export function useRegisterMutation(
  param?: OldMutationParams<UsuarioDto, UsuarioCreateDto>,
) {
  return useMutation({
    mutationFn: async (userData: UsuarioCreateDto) => {
      return await $fetch('@post/auth/register', {
        body: userData,
      });
    },

    onSuccess: async (data, variables) => {
      param?.onSuccess?.(data, variables);
      toast.success('Conta criada com sucesso');
    },

    onError: (error) => {
      param?.onError?.(error);
      toast.error('Erro ao criar conta');
    },
  });
}
