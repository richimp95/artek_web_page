import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface BadgeProps {
  className?: string;
  variant?: BadgeVariant;
  children?: unknown;
}

const badgeVariants = cva(
  'tw:inline-flex tw:items-center tw:gap-1.5 tw:rounded-full tw:border tw:px-3 tw:py-1 tw:text-xs tw:font-medium tw:leading-none tw:transition-colors',
  {
    variants: {
      variant: {
        default: 'tw:border-transparent tw:bg-white tw:text-neutral-950',
        secondary: 'tw:border-transparent tw:bg-white/10 tw:text-white',
        destructive: 'tw:border-transparent tw:bg-red-500 tw:text-white',
        outline: 'tw:border-white/15 tw:bg-white/10 tw:text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
