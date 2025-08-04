import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

// Enhanced button variants with additional options
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 
          'hover:bg-accent hover:text-accent-foreground',
        link: 
          'text-primary underline-offset-4 hover:underline',
        // Additional variants for enhanced functionality
        success:
          'bg-green-600 text-white shadow hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800',
        warning:
          'bg-yellow-600 text-white shadow hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800',
        info:
          'bg-blue-600 text-white shadow hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        xl: 'h-12 rounded-md px-10 text-base',
        icon: 'h-9 w-9',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-10 w-10',
      },
      // Additional variant for loading state styling
      loading: {
        true: 'cursor-not-allowed',
        false: '',
      },
      // Additional variant for full width
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      loading: false,
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    fullWidth,
    asChild = false,
    disabled,
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : 'button';
    
    // Determine if button should be disabled (original disabled prop or loading state)
    const isDisabled = disabled || loading;
    
    // Loading spinner component
    const LoadingSpinner = () => (
      <svg
        className="animate-spin h-4 w-4 mr-2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    const buttonContent = (
      <>
        {loading && <LoadingSpinner />}
        {!loading && leftIcon && (
          <span className="mr-2 flex-shrink-0">{leftIcon}</span>
        )}
        <span className={cn(loading && 'opacity-0')}>
          {loading && loadingText ? loadingText : children}
        </span>
        {!loading && rightIcon && (
          <span className="ml-2 flex-shrink-0">{rightIcon}</span>
        )}
      </>
    );

    return (
      <Comp
        className={cn(
          buttonVariants({ 
            variant, 
            size, 
            loading, 
            fullWidth, 
            className 
          })
        )}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {buttonContent}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

// Utility function to create icon buttons easily
export const IconButton = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'leftIcon' | 'rightIcon'> & { icon: React.ReactNode }
>(({ icon, children, ...props }, ref) => (
  <Button ref={ref} {...props}>
    {children ? (
      <>
        <span className="mr-2">{icon}</span>
        {children}
      </>
    ) : (
      icon
    )}
  </Button>
));

IconButton.displayName = 'IconButton';

// Utility function for loading buttons
export const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { isLoading?: boolean }
>(({ isLoading, ...props }, ref) => (
  <Button ref={ref} loading={isLoading} {...props} />
));

LoadingButton.displayName = 'LoadingButton';

// Pre-configured button variants for common use cases
export const PrimaryButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button ref={ref} variant="default" {...props} />
);
PrimaryButton.displayName = 'PrimaryButton';

export const SecondaryButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button ref={ref} variant="secondary" {...props} />
);
SecondaryButton.displayName = 'SecondaryButton';

export const DangerButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button ref={ref} variant="destructive" {...props} />
);
DangerButton.displayName = 'DangerButton';

export const GhostButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button ref={ref} variant="ghost" {...props} />
);
GhostButton.displayName = 'GhostButton';

export const LinkButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button ref={ref} variant="link" {...props} />
);
LinkButton.displayName = 'LinkButton';

// Export everything
export { 
  Button, 
  buttonVariants,
};