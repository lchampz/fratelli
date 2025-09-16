import * as React from 'react';
import { cn } from '../../lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, ...props }, ref) => {
		return (
			<input
				ref={ref}
				className={cn(
					'flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-all duration-200',
					'focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 focus:outline-none',
					'hover:border-gray-300',
					'placeholder:text-gray-500',
					'disabled:cursor-not-allowed disabled:opacity-50',
					className
				)}
				aria-invalid={props['aria-invalid'] || (props.type === 'email' && !props.value?.toString().includes('@'))}
				{...props}
			/>
		);
	}
);
Input.displayName = 'Input'; 