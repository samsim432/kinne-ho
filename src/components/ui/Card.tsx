import React from 'react';
import { cn } from '../../lib/utils';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-surface-card border border-surface-border rounded-xl shadow-card transition-shadow hover:shadow-elevated",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};