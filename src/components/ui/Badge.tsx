import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'info' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center font-medium rounded-md text-xs px-2.5 py-0.5";

  const variants = {
    default: "bg-surface-100 text-slate-700 border border-surface-border",
    success: "bg-brand-green-50 text-brand-green-700 border border-brand-green-100",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    info: "bg-brand-blue-50 text-brand-blue-800 border border-brand-blue-100",
    neutral: "bg-slate-100 text-slate-600",
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
};