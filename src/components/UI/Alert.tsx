import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const variantConfig: Record<AlertVariant, { icon: React.ElementType; styles: string }> = {
  info: { icon: Info, styles: 'border-secondary/50 text-foreground' },
  success: { icon: CheckCircle, styles: 'border-success/50 text-foreground' },
  warning: { icon: AlertTriangle, styles: 'border-warning/50 text-foreground' },
  error: { icon: AlertCircle, styles: 'border-destructive/50 text-foreground' },
};

export function Alert({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className,
}: AlertProps) {
  const { icon: Icon, styles } = variantConfig[variant];

  // WCAG: assertive (role="alert") for errors/warnings, polite (aria-live="polite") for success/info
  const role = variant === 'error' || variant === 'warning' ? 'alert' : undefined;
  const ariaLive = variant === 'info' || variant === 'success' ? 'polite' : 'assertive';

  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={cn(
        'flex gap-3 rounded-lg border bg-surface-raised p-4 shadow-sm items-start justify-between',
        styles,
        className
      )}
    >
      <div className="flex gap-3 flex-1 items-start">
        <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div>
          {title && <p className="font-medium text-sm text-foreground">{title}</p>}
          <div className="text-sm text-foreground-muted">{children}</div>
        </div>
      </div>

      {dismissible && (
        <button
          onClick={onDismiss}
          className="btn btn-ghost btn-xs btn-circle text-current hover:bg-surface-overlay focus-ring"
          aria-label="Meldung schließen"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default Alert;
