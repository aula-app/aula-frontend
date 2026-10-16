import { twMerge } from 'tailwind-merge';

interface FieldBoxOptions {
  dense?: boolean;
  invalid?: boolean;
  hasStart?: boolean;
  hasEnd?: boolean;
}

export const fieldBoxClasses = ({ dense, invalid, hasStart, hasEnd }: FieldBoxOptions) =>
  twMerge(
    'peer block w-full rounded-lg border border-input-border bg-transparent shadow-inner focus-within:outline-1',
    dense ? 'h-9 px-3' : 'h-12 px-4',
    'text-sm text-foreground transition-colors duration-200',
    'hover:border-input-border-hover',
    hasStart ? (dense ? 'pl-8' : 'pl-10') : '',
    hasEnd ? (dense ? 'pr-8' : 'pr-10') : '',
    invalid ? 'border-error-fg outline-error-fg focus:border-error-fg' : 'outline-current focus:border-current',
    'disabled:cursor-not-allowed disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:opacity-50'
  );

export const listBoxClasses =
  'rounded-lg border border-input-border bg-background shadow-md overflow-auto py-1 outline-none';

export const popoverClasses = 'text-foreground';
