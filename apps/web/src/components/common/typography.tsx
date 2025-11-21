import React, { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils/class';

// Individual Typography Components

export function TypographyH1({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn('scroll-m-20 text-4xl font-extrabold tracking-tight text-balance', className)}
      {...props}
    >
      {children}
    </h1>
  );
}

export function TypographyH2({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        'mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function TypographyH3({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('mt-8 scroll-m-20 text-2xl font-semibold tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function TypographyH4({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4 className={cn('scroll-m-20 text-xl font-semibold tracking-tight', className)} {...props}>
      {children}
    </h4>
  );
}

export function TypographyP({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('leading-7 [&:not(:first-child)]:mt-6', className)} {...props}>
      {children}
    </p>
  );
}

export function TypographyBlockquote({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote className={cn('mt-6 border-l-2 pl-6 italic', className)} {...props}>
      {children}
    </blockquote>
  );
}

export function TypographyTable({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('my-6 w-full overflow-y-auto', className)} {...props}>
      <table className="w-full">{children}</table>
    </div>
  );
}

export function TypographyList({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)} {...props}>
      {children}
    </ul>
  );
}

export function TypographyInlineCode({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}

export function TypographyLead({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-muted-foreground text-xl', className)} {...props}>
      {children}
    </p>
  );
}

export function TypographyLarge({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('text-lg font-semibold', className)} {...props}>
      {children}
    </div>
  );
}

export function TypographySmall({ children, className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <small className={cn('text-sm leading-none font-medium', className)} {...props}>
      {children}
    </small>
  );
}

export function TypographyMuted({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-muted-foreground text-sm', className)} {...props}>
      {children}
    </p>
  );
}

// Unified Text Component

type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'p'
  | 'blockquote'
  | 'list'
  | 'inlineCode'
  | 'lead'
  | 'large'
  | 'small'
  | 'muted';

interface TextProps {
  variant?: TextVariant;
  children: ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export function Text({
  variant = 'p',
  children,
  className,
  as,
  ...props
}: TextProps & HTMLAttributes<HTMLElement>) {
  const variantMap = {
    h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight text-balance',
    h2: 'mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0',
    h3: 'mt-8 scroll-m-20 text-2xl font-semibold tracking-tight',
    h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
    p: 'leading-7 [&:not(:first-child)]:mt-6',
    blockquote: 'mt-6 border-l-2 pl-6 italic',
    list: 'my-6 ml-6 list-disc [&>li]:mt-2',
    inlineCode: 'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
    lead: 'text-muted-foreground text-xl',
    large: 'text-lg font-semibold',
    small: 'text-sm leading-none font-medium',
    muted: 'text-muted-foreground text-sm',
  };

  const elementMap: Record<TextVariant, keyof React.JSX.IntrinsicElements> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    p: 'p',
    blockquote: 'blockquote',
    list: 'ul',
    inlineCode: 'code',
    lead: 'p',
    large: 'div',
    small: 'small',
    muted: 'p',
  };

  const Component = (as || elementMap[variant]) as any;
  const variantClassName = variantMap[variant];

  return (
    <Component className={cn(variantClassName, className)} {...props}>
      {children}
    </Component>
  );
}
