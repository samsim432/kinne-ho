import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  
  const variants = {
    primary: "bg-brand-green-600 text-white hover:bg-brand-green-700 focus:ring-brand-green-500 shadow-sm",
    secondary: "bg-brand-blue-900 text-white hover:bg-slate-800 focus:ring-brand-blue-900 shadow-sm",
    outline: "border border-surface-border bg-white text-brand-blue-900 hover:bg-surface-100 focus:ring-brand-blue-600",
    ghost: "bg-transparent text-brand-blue-900 hover:bg-surface-100 focus:ring-brand-blue-600",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 h-8 gap-1.5",
    md: "text-sm px-4 py-2 h-10 gap-2",
    lg: "text-base px-6 py-3 h-12 gap-2.5",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};