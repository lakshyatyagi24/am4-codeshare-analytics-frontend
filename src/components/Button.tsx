import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className, variant = 'primary' }) => {
  const baseClasses = 'px-6 py-3 font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105';
  
  const variants = {
    primary: 'bg-cyan-500 text-white hover:bg-cyan-400',
    secondary: 'bg-red-500 text-white hover:bg-red-400',
    accent: 'bg-teal-500 text-white hover:bg-teal-400',
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
