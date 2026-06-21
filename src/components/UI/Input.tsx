import React, { useId } from 'react';
import * as Label from '@radix-ui/react-label';
import { cn } from '@/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  hint?: string;
  isRequired?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      hint,
      isRequired = false,
      required,
      id,
      className,
      icon: Icon,
      ...props
    },
    ref
  ) => {
    const fallbackId = useId();
    const inputId = id || fallbackId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    const hintId = `${inputId}-hint`;

    const activeRequired = isRequired || required;
    const activeHelper = helperText || hint;

    // Combine helper and error IDs for aria-describedby
    const describedByIds = [];
    if (activeHelper) {
      describedByIds.push(helperText ? helperId : hintId);
    }
    if (error) describedByIds.push(errorId);
    const ariaDescribedBy = describedByIds.length > 0 ? describedByIds.join(' ') : undefined;

    return (
      <div className="w-full flex flex-col gap-1.5">
        <Label.Root
          htmlFor={inputId}
          className="text-sm font-bold text-foreground block"
        >
          <span>{label}</span>
          {activeRequired && (
            <span className="text-destructive ml-1" aria-hidden="true" title="Pflichtfeld">
              *
            </span>
          )}
        </Label.Root>
        
        <div className="relative w-full">
          {Icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-required={activeRequired ? 'true' : undefined}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={ariaDescribedBy}
            className={cn(
              'h-11 w-full text-sm rounded-lg bg-black border border-surface-border text-foreground transition-all duration-150 block',
              Icon ? 'pl-10 pr-3.5' : 'px-3.5',
              'placeholder:text-foreground-muted/50 focus:outline-none focus:border-primary',
              error
                ? 'border-destructive focus:border-destructive'
                : 'hover:border-foreground-muted/65',
              className
            )}
            required={activeRequired}
            {...props}
          />
        </div>

        {error && (
          <p id={errorId} className="text-xs text-destructive font-medium mt-0.5" role="alert">
            {error}
          </p>
        )}

        {activeHelper && !error && (
          <p id={helperText ? helperId : hintId} className="text-xs text-foreground-muted mt-0.5">
            {activeHelper}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
