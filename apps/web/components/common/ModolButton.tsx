'use client';

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ModolButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-sunny text-ink border-2 border-sunny-shade [--lip-color:#E0A500] shadow-lip-md',
  secondary:
    'bg-paper text-splash border-2 border-line-strong [--lip-color:#D6C6AD] shadow-lip-md',
  success:
    'bg-fresh text-paper border-2 border-fresh-shade [--lip-color:#3AA14F] shadow-lip-md',
  danger:
    'bg-cherry text-paper border-2 border-cherry-shade [--lip-color:#D93636] shadow-lip-md',
  ghost:
    'bg-transparent text-ink-soft border-2 border-transparent shadow-none hover:bg-sand',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-xs rounded-md',
  md: 'h-11 px-5 text-sm rounded-lg',
  lg: 'h-[52px] px-6 text-base rounded-lg',
};

export function ModolButton({
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...rest
}: ModolButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-sans font-extrabold uppercase tracking-wider transition-transform duration-75 select-none ${
        disabled
          ? 'bg-sand text-ink-faint border-2 border-line cursor-not-allowed shadow-none'
          : `${VARIANT_CLASSES[variant]} active:translate-y-1 active:shadow-none`
      } ${SIZE_CLASSES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
