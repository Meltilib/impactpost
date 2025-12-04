import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-transform active:translate-y-[2px] active:translate-x-[2px] active:shadow-none border-2 border-black";
  
  const variants = {
    primary: "bg-brand-purple text-white shadow-hard hover:bg-brand-purple/90",
    secondary: "bg-brand-yellow text-black shadow-hard hover:bg-brand-yellow/90",
    accent: "bg-brand-coral text-white shadow-hard hover:bg-brand-coral/90",
    outline: "bg-transparent text-black shadow-hard hover:bg-gray-50",
    ghost: "border-transparent shadow-none hover:bg-gray-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};