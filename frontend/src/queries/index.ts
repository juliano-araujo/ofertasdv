import { QueryClient, UseMutationOptions } from '@tanstack/react-query';

export type DefaultApiErrorType = Error;

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1 * 60 * 1000,
        retry: 1,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

export interface MappedOptions {
  enabled?: boolean;
}

// Deprecated - use MutationParams instead
export type OldMutationParams<
  TData = unknown,
  TVariables = unknown,
  TError = DefaultApiErrorType,
> = {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError) => void;
};

export type MutationParams<
  TData = unknown,
  TVariables = unknown,
  TError = DefaultApiErrorType,
> = Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>;
