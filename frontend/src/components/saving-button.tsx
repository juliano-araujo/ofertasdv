import React from 'react';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';

interface Props extends React.ComponentProps<'button'> {
  isPending?: boolean;
  text?: string;
  savingText?: string;
  children?: React.ReactNode;
}

export function SavingButton({
  isPending = false,
  text = 'Save',
  savingText = 'Saving...',
  children,
  className,
  ...rest
}: Props) {
  return (
    <Button disabled={isPending} className={className} {...rest}>
      {!isPending ? (
        children || <span>{text}</span>
      ) : (
        <>
          <Spinner />
          <span>{savingText}</span>
        </>
      )}
    </Button>
  );
}
