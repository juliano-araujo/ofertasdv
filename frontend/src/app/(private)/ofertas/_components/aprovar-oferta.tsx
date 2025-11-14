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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAprovarOfertaMutation } from '@/queries/oferta.queries';
import { CheckIcon } from 'lucide-react';
import { useState } from 'react';

interface AprovarOfertaProps {
  id: number;
  name: string;
  adminId: number;
}

export function AprovarOferta({ id, name, adminId }: AprovarOfertaProps) {
  const [open, setOpen] = useState(false);
  const aprovarMutation = useAprovarOfertaMutation({
    onSuccess: () => setOpen(false),
  });

  const handleAprovar = () => {
    aprovarMutation.mutate({ id });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="icon">
              <CheckIcon className="text-success" />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <span>Aprovar oferta</span>
        </TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Aprovar Oferta</AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a aprovar a oferta <strong>{name}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleAprovar}
            disabled={aprovarMutation.isPending}
            className="bg-success text-success-foreground hover:bg-success/90"
          >
            {aprovarMutation.isPending ? 'Aprovando...' : 'Aprovar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
