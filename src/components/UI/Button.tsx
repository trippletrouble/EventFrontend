import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'destructive' | 'outline' | 'ghost' | 'none';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  asChild?: boolean;
}

const variantStyles = {
  primary: 'bg-primary text-primary-foreground hover:bg-[#CA8A04] border-2 border-primary hover:border-yellow-500',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-[#2563EB] border-2 border-secondary hover:border-blue-600',
  accent: 'bg-accent text-accent-foreground hover:bg-[#09C37F] border-2 border-accent hover:border-emerald-500',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-[#DC2626] border-2 border-destructive hover:border-red-600',
  outline: 'border-2 border-surface-border bg-transparent hover:bg-surface-raised text-foreground',
  ghost: 'bg-transparent hover:bg-surface-raised text-foreground',
  none: '',
};

const sizeStyles = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText = 'Wird geladen',
      asChild = false,
      onClick,
      disabled,
      'aria-disabled': customAriaDisabled,
      type = 'button',
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isActuallyDisabled = disabled || isLoading || customAriaDisabled === true || customAriaDisabled === 'true';

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isActuallyDisabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        onClick={handleClick}
        aria-busy={isLoading ? 'true' : undefined}
        aria-disabled={isActuallyDisabled ? 'true' : undefined}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-ring',
          variantStyles[variant],
          sizeStyles[size],
          isActuallyDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="h-4 w-4 animate-spin shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {isLoading && loadingText && !asChild ? (
          <span className="sr-only">{loadingText}</span>
        ) : null}
        <span className={cn(isLoading && 'opacity-90')}>{children}</span>
      </Comp>
    );
  }
);

Button.displayName = 'Button';
export default Button;
