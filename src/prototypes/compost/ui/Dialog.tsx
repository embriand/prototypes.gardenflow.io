// File: components/compost/ui/Dialog.tsx
import React from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => onOpenChange(false)} />
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogContent: React.FC<DialogContentProps> = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

interface DialogHeaderProps {
  children: React.ReactNode;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => (
  <div className="mb-4">
    {children}
  </div>
);

interface DialogTitleProps {
  children: React.ReactNode;
}

export const DialogTitle: React.FC<DialogTitleProps> = ({ children }) => (
  <h2 className="text-xl font-semibold">
    {children}
  </h2>
);

interface DialogDescriptionProps {
  children: React.ReactNode;
}

export const DialogDescription: React.FC<DialogDescriptionProps> = ({ children }) => (
  <p className="text-sm text-gray-500 mt-1">
    {children}
  </p>
);

interface DialogCloseButtonProps {
  onClick: () => void;
}

export const DialogCloseButton: React.FC<DialogCloseButtonProps> = ({ onClick }) => (
  <button onClick={onClick} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
    <X className="w-5 h-5" />
  </button>
);