/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React from 'react';
import { cn } from '@/utils/cn';

interface FeatureItemProps {
  icon: React.ReactNode;
  iconColor?: string;
  borderColorClass?: string;
  title: string;
  description: string;
  className?: string;
  theme?: 'dark' | 'light';
}

export function FeatureItem({
  icon,
  iconColor = 'text-primary',
  borderColorClass,
  title,
  description,
  className,
  theme = 'dark',
}: FeatureItemProps) {
  return (
    <div
      tabIndex={0}
      className={cn(
        'flex gap-4 items-start rounded-lg p-3 w-full transition-all focus-ring',
        theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-surface-raised/30',
        className
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-[6px] bg-transparent border-2',
          iconColor,
          borderColorClass || 'border-transparent'
        )}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div>
        <h4 className={cn(
          'font-bold text-lg mb-1',
          theme === 'light' ? 'text-slate-900' : 'text-foreground'
        )}>
          {title}
        </h4>
        <p className={cn(
          'text-sm leading-relaxed',
          theme === 'light' ? 'text-slate-700' : 'text-foreground-muted'
        )}>
          {description}
        </p>
      </div>
    </div>
  );
}
