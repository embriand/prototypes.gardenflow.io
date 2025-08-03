import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'destructive';
  children: React.ReactNode;
}

export const Button = ({ 
  variant = 'default', 
  children, 
  className = '',
  disabled,
  ...props 
}: ButtonProps) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200';
  const variantStyles = {
    default: 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50',
    outline: 'border border-gray-700 hover:border-indigo-500 text-gray-300 hover:text-white disabled:opacity-50 disabled:hover:border-gray-700 disabled:hover:text-gray-300',
    destructive: 'bg-red-600 hover:bg-red-700 text-white disabled:opacity-50'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};