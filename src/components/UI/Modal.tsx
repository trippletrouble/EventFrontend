'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface ModalProps {
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Modal({
  isOpen,
  open,
  onClose,
  onOpenChange,
  title,
  description,
  children,
  actions,
  size = 'md',
  className,
}: ModalProps) {
  // Support both isOpen/onClose and open/onOpenChange
  const activeOpen = open !== undefined ? open : (isOpen !== undefined ? isOpen : false);
  
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
    if (!newOpen && onClose) {
      onClose();
    }
  };

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-4xl',
  };

  return (
    <Dialog.Root open={activeOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-[fadeIn_200ms] data-[state=closed]:animate-[fadeOut_200ms]"
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Dialog.Content
            className={cn(
              'w-full rounded-xl border border-surface-border bg-surface-raised shadow-2xl flex flex-col focus:outline-none max-h-[90vh]',
              'data-[state=open]:animate-[contentShow_200ms]',
              sizeClasses[size],
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
              <div>
                <Dialog.Title className="text-xl font-bold text-foreground">
                  {title}
                </Dialog.Title>
                {description && (
                  <Dialog.Description className="mt-1 text-sm text-foreground-muted">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              <Dialog.Close asChild>
                <button
                  className="h-8 w-8 flex items-center justify-center rounded-full text-foreground-muted hover:text-foreground hover:bg-surface-overlay/20 focus-ring transition-colors"
                  aria-label="Modal schließen"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 text-foreground leading-relaxed text-sm">
              {children}
            </div>

            {/* Actions (Footer) */}
            {actions && (
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-surface-border bg-surface-overlay/30 rounded-b-xl">
                {actions}
              </div>
            )}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export const ModalTrigger = Dialog.Trigger;
export const ModalClose = Dialog.Close;
export default Modal;
