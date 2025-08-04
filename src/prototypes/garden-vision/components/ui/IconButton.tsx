import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  title?: string;
  children?: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  title,
  children
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4'
  };
  
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };
  
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500 disabled:bg-blue-300',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-500 disabled:bg-gray-300',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 disabled:bg-red-300'
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      title={title}
    >
      <Icon size={iconSizes[size]} />
      {children && <span className="ml-2">{children}</span>}
    </button>
  );
};