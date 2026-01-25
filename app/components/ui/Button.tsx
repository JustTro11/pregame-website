import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming we have or will create a utils file, standard in shadcn/tailwind projects

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

export default function Button({
    className,
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 disabled:opacity-50 disabled:cursor-not-allowed font-heading rounded-md active:scale-95";

    const variants = {
        primary: "bg-accent-primary text-background hover:bg-accent-secondary shadow-lg shadow-accent-primary/20",
        secondary: "bg-bg-elevated text-foreground hover:bg-white/10 border border-white/5",
        outline: "border-2 border-border-default text-foreground hover:border-accent-primary hover:text-accent-primary bg-transparent",
        ghost: "bg-transparent text-foreground hover:bg-white/5 hover:text-accent-primary",
        danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20",
    };

    const sizes = {
        sm: "h-8 px-3 text-xs gap-1.5",
        md: "h-10 px-4 py-2 text-sm gap-2",
        lg: "h-12 px-6 text-base gap-2.5",
        icon: "h-10 w-10 p-2",
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="animate-spin" size={size === 'sm' ? 14 : 18} />}
            {!isLoading && leftIcon}
            {children}
            {!isLoading && rightIcon}
        </button>
    );
}
