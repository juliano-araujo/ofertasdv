'use client';

import { OptionalImage } from '@/components/optional-image';
import { TableSkeleton } from '@/components/table-skeleton';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSession } from '@/contexts/session-context';
import { useDebounce } from '@/hooks/use-debounce';
import { useMinhasOfertas } from '@/queries/oferta.queries';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { AprovarOferta } from './_components/aprovar-oferta';
import {
  CreateOfertaDialog,
  EditOfertaDialog,
} from './_components/oferta-dialog';
import { RejeitarOferta } from './_components/rejeitar-oferta';

export default function Ofertas() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { hasRole } = useSession();
  const { data, isLoading } = useMinhasOfertas({
    nome: debouncedSearchTerm || undefined,
    page: 0,
    size: 50,
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDENTE: 'secondary',
      APROVADO: 'default',
      REJEITADO: 'destructive',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {status}
      </Badge>
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(date));
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-row items-center justify-between pt-8">
          <h1 className="text-2xl font-bold tracking-wider text-foreground">
            Ofertas
          </h1>
          {hasRole('COMERCIANTE') && <CreateOfertaDialog />}
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="rounded-2xl border bg-background">
          <div className="m-6 flex flex-row justify-between">
            <div className="flex gap-3">{/* Add filters here if needed */}</div>
            <InputGroup className="w-sm">
              <InputGroupInput
                placeholder="Buscar por produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div className="max-w-screen overflow-x-auto px-2">
            {data?.numberOfElements === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>Nenhuma oferta encontrada</EmptyTitle>
                  <EmptyDescription>
                    Não há ofertas disponíveis no momento. Tente ajustar os
                    filtros de busca.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <Table className="w-full table-auto">
                <TableHeader>
                  <TableRow className="**:font-medium **:text-muted-foreground">
                    <TableHead className="w-10">
                      <Checkbox />
                    </TableHead>
                    <TableHead className="w-18">ID</TableHead>
                    <TableHead>FOTO</TableHead>
                    <TableHead>PRODUTO</TableHead>
                    <TableHead>PREÇO</TableHead>
                    <TableHead>QTD</TableHead>
                    <TableHead>DESCRIÇÃO</TableHead>
                    <TableHead>STATUS</TableHead>
                    <TableHead>COMERCIANTE</TableHead>
                    <TableHead>DATA</TableHead>
                    <TableHead className="w-32">AÇÕES</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableSkeleton columns={11} rows={5} />
                  ) : (
                    data?.content?.map((item) => (
                      <TableRow
                        key={item.id}
                        className="*:data-[slot=table-cell]:align-middle"
                      >
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>
                          <div className="relative flex aspect-video h-14 w-20 items-center justify-center overflow-hidden rounded-md">
                            <OptionalImage
                              src={item.fotoUrl}
                              fill
                              priority
                              alt={`${item.nomeProduto} foto`}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.nomeProduto}
                        </TableCell>
                        <TableCell>{formatCurrency(item.preco)}</TableCell>
                        <TableCell>{item.quantidade}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="line-clamp-2 wrap-break-word whitespace-normal">
                            {item.descricao}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>{item.comercianteNome}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(item.dataCriacao)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {hasRole('COMERCIANTE') && (
                              <EditOfertaDialog id={item.id} oferta={item} />
                            )}
                            {hasRole('ADMINISTRADOR') &&
                              item.status === 'PENDENTE' && (
                                <>
                                  <AprovarOferta
                                    id={item.id}
                                    name={item.nomeProduto}
                                    adminId={1}
                                  />
                                  <RejeitarOferta
                                    id={item.id}
                                    name={item.nomeProduto}
                                    adminId={1}
                                  />
                                </>
                              )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
          <div className="py-8"></div>
        </div>
      </div>
    </div>
  );
}
