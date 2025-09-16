import * as React from 'react';
import { cn } from '../../lib/utils';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
	({ className, children, ...props }, ref) => (
		<select
			ref={ref}
			className={cn(
				'flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-all duration-200',
				'focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-20 focus:outline-none',
				'hover:border-gray-300',
				'disabled:cursor-not-allowed disabled:opacity-50',
				className
			)}
			{...props}
		>
			{children}
		</select>
	)
);
Select.displayName = 'Select'; 