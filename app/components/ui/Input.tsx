import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    className={cn(
                        "input-field",
                        error && "border-red-500 focus:border-red-500 focus:shadow-none focus:ring-1 focus:ring-red-500/50",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-xs text-red-500 ml-1 font-medium">{error}</p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export default Input;
