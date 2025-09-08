import * as React from 'react';
import { cn } from '../../lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
	({ className, children, ...props }, ref) => (
		<select
			ref={ref}
			className={cn('h-10 rounded-md bg-white/90 px-3 py-2 text-sm text-[#68472B] shadow-sm focus:bg-white', className)}
			{...props}
		>
			{children}
		</select>
	)
);
Select.displayName = 'Select'; 