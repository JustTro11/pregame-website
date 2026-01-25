import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'elevated';
    hoverEffect?: boolean;
}

export default function Card({
    className,
    variant = 'default',
    hoverEffect = false,
    children,
    ...props
}: CardProps) {
    const variants = {
        default: "bg-bg-card border border-border-default",
        glass: "glass-card",
        elevated: "bg-bg-elevated border border-white/5 shadow-lg",
    };

    return (
        <div
            className={cn(
                "rounded-xl p-6 transition-all duration-300",
                variants[variant],
                hoverEffect && "hover:translate-y-[-4px] hover:shadow-xl hover:border-accent-primary/30",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
