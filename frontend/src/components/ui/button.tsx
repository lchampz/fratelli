import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:opacity-50 disabled:pointer-events-none active:scale-95',
	{
		variants: {
			variant: {
				default: 'bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700 shadow-sm',
				secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm',
				ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
				danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
				success: 'bg-green-600 text-white hover:bg-green-700 shadow-sm',
				outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
			},
			size: {
				sm: 'h-8 px-3 text-xs',
				md: 'h-10 px-4',
				lg: 'h-12 px-6 text-base',
				icon: 'h-10 w-10 p-0',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'md',
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, ...props }, ref) => {
		return (
			<button 
				ref={ref} 
				className={cn(buttonVariants({ variant, size }), className)} 
				aria-label={props['aria-label'] || (typeof props.children === 'string' ? props.children : undefined)}
				{...props} 
			/>
		);
	}
);
Button.displayName = 'Button';

export { buttonVariants }; 