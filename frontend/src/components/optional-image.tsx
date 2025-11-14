import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

interface OptionalImageProps
  extends Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'> {
  src?: string | null;
  alt: string;
  fallbackText?: string;
}

export function OptionalImage({
  src,
  alt,
  className,
  sizes = '(min-width: 640px) 16rem, 100vw',
  priority = false,
  fallbackText = 'No image',
  ...imageProps
}: OptionalImageProps) {
  return src ? (
    <Image
      src={src}
      alt={alt}
      sizes={sizes}
      priority={priority}
      className={cn('object-cover', className)}
      {...imageProps}
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
      {fallbackText}
    </div>
  );
}
