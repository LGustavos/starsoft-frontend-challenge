'use client';

import { forwardRef, memo, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import styles from './Button.module.scss';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        children,
        className,
        variant = 'primary',
        size = 'md',
        fullWidth = false,
        isLoading = false,
        disabled,
        ...props
      },
      ref
    ) => {
      return (
        <button
          ref={ref}
          className={cn(
            styles.button,
            styles[variant],
            styles[size],
            fullWidth && styles.fullWidth,
            isLoading && styles.loading,
            className
          )}
          disabled={disabled || isLoading}
          {...props}
        >
          {isLoading ? (
            <span className={styles.spinner} aria-hidden="true" />
          ) : (
            children
          )}
        </button>
      );
    }
  )
);

Button.displayName = 'Button';
