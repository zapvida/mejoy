'use client';

import { Slot } from '@radix-ui/react-slot';
import classNames from 'classnames';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  color?: 'green' | 'white' | 'black' | string;
  className?: string;
  fullWidth?: boolean;
  rounded?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  asChild?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive';
}

const Button = ({
  children,
  color = 'green',
  className = '',
  fullWidth = false,
  rounded = 'xl',
  asChild = false,
  size = 'md',
  variant = 'default',
  ...rest
}: ButtonProps) => {
  const baseColor = {
    green: 'bg-green-500 hover:bg-green-600 text-white',
    white: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200',
    black: 'bg-gray-900 hover:bg-gray-800 text-white border border-gray-700',
  };

  const baseSize = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const baseVariant = {
    default: '',
    outline: 'bg-transparent border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white',
    ghost: 'bg-transparent hover:bg-green-50 text-green-500',
    link: 'bg-transparent underline text-green-500 hover:text-green-600',
    destructive: 'bg-red-500 hover:bg-red-600 text-white',
  };

  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={classNames(
        'flex items-center justify-center gap-2 font-semibold shadow-lg backdrop-blur-md transition-all duration-300',
        baseColor[color as keyof typeof baseColor] || color,
        fullWidth && 'w-full',
        `rounded-${rounded}`,
        baseSize[size],
        baseVariant[variant],
        'hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg',
        className
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
};

export default Button;