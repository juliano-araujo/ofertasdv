'use client';

import { OptionalImage } from '@/components/optional-image';
import { PaginationControls } from '@/components/pagination-controls';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { useDebounce } from '@/hooks/use-debounce';
import { useOfertas } from '@/queries/oferta.queries';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Store,
  XCircle,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'APROVADO':
      return {
        label: 'Aprovado',
        variant: 'default' as const,
        icon: CheckCircle2,
        className: 'bg-success text-success-foreground',
      };
    case 'PENDENTE':
      return {
        label: 'Pendente',
        variant: 'secondary' as const,
        icon: Clock,
        className: 'bg-warning text-warning-foreground',
      };
    case 'REJEITADO':
      return {
        label: 'Rejeitado',
        variant: 'destructive' as const,
        icon: XCircle,
        className: 'bg-muted text-muted-foreground',
      };
    default:
      return {
        label: status,
        variant: 'outline' as const,
        icon: Clock,
        className: '',
      };
  }
};

const ITEMS_PER_PAGE = 6;

export default function OffersPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data, isLoading, isError } = useOfertas({
    nome: debouncedSearchQuery || undefined,
    page: currentPage,
    size: ITEMS_PER_PAGE,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
  };

  const totalPages = data?.totalPages ?? 0;
  const currentOffers = data?.content ?? [];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="w-full">
            <InputGroup className="w-full">
              <InputGroupAddon>
                <Search className="size-4" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </InputGroup>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner className="h-8 w-8" />
          </div>
        ) : isError ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <AlertCircle className="text-destructive" />
              </EmptyMedia>
              <EmptyTitle>Erro ao carregar ofertas</EmptyTitle>
              <EmptyDescription>
                Não foi possível carregar as ofertas. Tente novamente mais
                tarde.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : currentOffers.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Search />
              </EmptyMedia>
              <EmptyTitle>Nenhuma oferta encontrada</EmptyTitle>
              <EmptyDescription>
                {searchQuery
                  ? `Não encontramos ofertas para "${searchQuery}". Tente outro termo de busca.`
                  : 'Não há ofertas disponíveis no momento.'}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentOffers.map((offer) => {
              const statusConfig = getStatusConfig(offer.status);
              const StatusIcon = statusConfig.icon;
              const isAvailable =
                offer.status === 'APROVADO' && offer.quantidade > 0;

              return (
                <Card
                  key={offer.id}
                  className="flex flex-col overflow-hidden transition-all hover:shadow-lg"
                >
                  <CardHeader className="p-0">
                    <div className="relative aspect-4/3 overflow-hidden bg-muted">
                      <OptionalImage
                        src={undefined}
                        alt={offer.nomeProduto}
                        width={400}
                        height={300}
                        className="h-full w-full transition-transform hover:scale-105"
                      />
                      <Badge
                        variant={statusConfig.variant}
                        className={`absolute top-3 right-3 gap-1 ${statusConfig.className}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 p-6">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg leading-snug font-semibold text-balance">
                          {offer.nomeProduto}
                        </h3>
                        <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Store className="h-3.5 w-3.5" />
                          <span>{offer.comercianteNome}</span>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
                        {offer.descricao}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t border-border bg-muted/30 p-6">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        R$ {offer.preco.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {offer.quantidade > 0 ? (
                          <span>{offer.quantidade} em estoque</span>
                        ) : (
                          <span className="text-destructive">
                            Fora de estoque
                          </span>
                        )}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            {!isLoading && data && (
              <>
                Mostrando {data.totalElements} oferta
                {data.totalElements !== 1 ? 's' : ''} • Atualizado hoje
              </>
            )}
          </p>
        </div>
      </footer>
    </div>
  );
}
