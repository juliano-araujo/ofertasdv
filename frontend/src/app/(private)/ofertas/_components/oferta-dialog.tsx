'use client';

import { SavingButton } from '@/components/saving-button';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSession } from '@/contexts/session-context';
import {
  useCreateOfertaMutation,
  useUpdateOfertaMutation,
} from '@/queries/oferta.queries';
import { OfertaType } from '@/schemas/oferta.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { PencilIcon } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const editFormSchema = z.object({
  nomeProduto: z.string().min(1, 'Nome do produto é obrigatório'),
  preco: z.coerce.number().positive('Preço deve ser positivo'),
  quantidade: z.coerce.number().int().positive('Insira uma quantidade'),
  descricao: z
    .string()
    .max(1000, 'Descrição deve ter menos de 1000 caracteres'),
  // foto: z.file().optional(),
});

const createFormSchema = z.object({
  ...editFormSchema.shape,
});

type CreateFormType = z.infer<typeof createFormSchema>;
type EditFormType = z.infer<typeof editFormSchema>;

interface OfertaDialogBaseProps {
  trigger: ReactNode;
  title: string;
  tooltipText?: string;
}

interface CreateOfertaDialogProps extends OfertaDialogBaseProps {
  mode: 'create';
}

interface EditOfertaDialogProps extends OfertaDialogBaseProps {
  mode: 'edit';
  id: number;
  initialData: OfertaType;
}

type OfertaDialogProps = CreateOfertaDialogProps | EditOfertaDialogProps;

export function OfertaDialog(props: OfertaDialogProps) {
  const { mode, trigger, title, tooltipText } = props;
  const [open, setOpen] = useState(false);
  const { user } = useSession();

  function getDefaultValues(data: OfertaType): EditFormType {
    return {
      nomeProduto: data.nomeProduto,
      preco: data.preco,
      quantidade: data.quantidade,
      descricao: data.descricao,
    };
  }

  const form = useForm<CreateFormType | EditFormType>({
    resolver: zodResolver(
      mode === 'create' ? createFormSchema : editFormSchema,
    ) as any,
    defaultValues:
      props.mode === 'edit'
        ? getDefaultValues(props.initialData)
        : {
            nomeProduto: '',
            preco: 0,
            quantidade: 0,
            descricao: '',
          },
  });

  const createMutation = useCreateOfertaMutation({
    onSuccess: () => {
      setOpen(false);
      form.reset();
    },
  });

  const updateMutation = useUpdateOfertaMutation({
    onSuccess: () => setOpen(false),
  });

  const onSubmit = async (data: CreateFormType | EditFormType) => {
    console.log('data', data);

    if (mode === 'create') {
      createMutation.mutate(data as CreateFormType);
      return;
    }

    updateMutation.mutate({
      id: props.id,
      data: data as EditFormType,
    });
  };

  const isPending =
    mode === 'create' ? createMutation.isPending : updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {tooltipText ? (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>{trigger}</DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <span>{tooltipText}</span>
            </TooltipContent>
          </Tooltip>
        </>
      ) : (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      )}

      <DialogContent className="p-0! sm:max-w-xl">
        <DialogHeader className="mx-6 gap-0 py-6">
          <DialogTitle className="font-semibold">{title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mx-6 flex flex-col gap-4">
              <FormField
                control={form.control}
                name="nomeProduto"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Nome do Produto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Pizza Margherita" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="preco"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Preço (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantidade"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Quantidade</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descreva a oferta..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="foto"
                render={({
                  field: { onChange, onBlur, ref, value, ...restField },
                }) => (
                  <FormItem className="w-full">
                    <FormLabel>Foto (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => onChange(e.target.files?.[0])}
                        onBlur={onBlur}
                        ref={ref}
                        {...restField}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              */}
            </div>
            <Separator className="mt-6" />
            <DialogFooter className="mx-6 my-4 justify-between!">
              <DialogClose asChild>
                <Button className="hover:cursor-pointer" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>

              <SavingButton type="submit" isPending={isPending} />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Convenience components for specific use cases
export function CreateOfertaDialog() {
  return (
    <OfertaDialog
      mode="create"
      title="Nova Oferta"
      trigger={
        <Button className="hover:cursor-pointer hover:brightness-80">
          Criar Oferta
        </Button>
      }
    />
  );
}

export function EditOfertaDialog({
  id,
  oferta,
}: {
  id: number;
  oferta: OfertaType;
}) {
  return (
    <OfertaDialog
      mode="edit"
      title="Editar Oferta"
      id={id}
      initialData={oferta}
      tooltipText="Editar oferta"
      trigger={
        <Button variant="outline" size="icon">
          <PencilIcon />
        </Button>
      }
    />
  );
}
