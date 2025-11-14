'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useRejeitarOfertaMutation } from '@/queries/oferta.queries';
import { XIcon } from 'lucide-react';
import { useState } from 'react';

interface RejeitarOfertaProps {
  id: number;
  name: string;
  adminId: number;
}

export function RejeitarOferta({ id, name, adminId }: RejeitarOfertaProps) {
  const [open, setOpen] = useState(false);
  const [motivo, setMotivo] = useState('');
  const rejeitarMutation = useRejeitarOfertaMutation({
    onSuccess: () => {
      setOpen(false);
      setMotivo('');
    },
  });

  const handleRejeitar = () => {
    rejeitarMutation.mutate({ id, motivo: motivo || undefined });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="icon">
              <XIcon className="text-destructive" />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <span>Rejeitar oferta</span>
        </TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Rejeitar Oferta</AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a rejeitar a oferta <strong>{name}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4">
          <Label htmlFor="motivo">Motivo (opcional)</Label>
          <Input
            id="motivo"
            placeholder="Digite o motivo da rejeição..."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="mt-2"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRejeitar}
            disabled={rejeitarMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {rejeitarMutation.isPending ? 'Rejeitando...' : 'Rejeitar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
