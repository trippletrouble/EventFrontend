'use client';

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';

type ToastType = 'info' | 'success' | 'warning' | 'error';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const variantStyles: Record<ToastType, string> = {
  info: 'border-secondary/50 bg-surface-raised text-foreground',
  success: 'border-success/50 bg-surface-raised text-foreground',
  warning: 'border-warning/50 bg-surface-raised text-foreground',
  error: 'border-destructive/50 bg-surface-raised text-foreground',
};

const variantIcons: Record<ToastType, React.ElementType> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        
        {toasts.map((toast) => {
          const Icon = variantIcons[toast.type];
          return (
            <ToastPrimitive.Root
              key={toast.id}
              open={true}
              onOpenChange={(open) => {
                if (!open) {
                  removeToast(toast.id);
                }
              }}
              className={cn(
                'relative flex items-center justify-between gap-3 rounded-lg border p-4 shadow-lg w-full max-w-sm',
                'data-[state=open]:animate-[fadeIn_200ms] data-[state=closed]:animate-[fadeOut_200ms]',
                variantStyles[toast.type]
              )}
            >
              <div className="flex gap-2.5 items-start flex-1 min-w-0">
                <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <ToastPrimitive.Title className="text-sm font-semibold text-foreground break-words">
                  {toast.message}
                </ToastPrimitive.Title>
              </div>
              <ToastPrimitive.Close asChild>
                <button
                  className="rounded-md p-1 text-foreground-muted hover:text-foreground focus-ring shrink-0 transition-colors"
                  aria-label="Schließen"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </ToastPrimitive.Close>
            </ToastPrimitive.Root>
          );
        })}
        
        <ToastPrimitive.Viewport
          className="fixed bottom-4 right-4 z-[100] flex max-w-sm w-full flex-col gap-2 p-4 outline-none"
        />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}
