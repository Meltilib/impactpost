import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
    const baseStyles = 'font-bold uppercase tracking-wide border-2 border-black transition-all inline-flex items-center justify-center';
    
    const variants = {
      primary: 'bg-black text-white hover:bg-brand-purple shadow-hard hover:shadow-hard-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-hard-sm',
      secondary: 'bg-white text-black hover:bg-gray-100 shadow-hard hover:shadow-hard-lg hover:-translate-y-0.5',
      accent: 'bg-brand-coral text-white hover:bg-brand-purple shadow-hard hover:shadow-hard-lg hover:-translate-y-0.5',
      outline: 'bg-transparent border-black text-black hover:bg-black hover:text-white',
      ghost: 'bg-transparent border-transparent text-black hover:bg-gray-100 shadow-none',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
