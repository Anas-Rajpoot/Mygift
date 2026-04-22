'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, label, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-[var(--cream)]"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            'flex h-11 w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--cream)] transition-colors',
            'placeholder:text-[var(--muted)]',
            'focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-[var(--rose)] focus:border-[var(--rose)] focus:ring-[var(--rose)]',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-[var(--rose)]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
