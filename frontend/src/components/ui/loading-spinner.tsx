import React from 'react';
import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
	const sizeClasses = {
		sm: 'h-4 w-4',
		md: 'h-6 w-6',
		lg: 'h-8 w-8',
	};

	return (
		<div
			className={cn(
				'animate-spin rounded-full border-2 border-current border-t-transparent',
				sizeClasses[size],
				className
			)}
			role="status"
			aria-label="Carregando"
		>
			<span className="sr-only">Carregando...</span>
		</div>
	);
}

export function LoadingButton({ 
	loading, 
	children, 
	className,
	...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
	return (
		<button
			{...props}
			disabled={loading || props.disabled}
			className={cn('relative', className)}
		>
			{loading && (
				<LoadingSpinner 
					size="sm" 
					className="absolute left-3 top-1/2 -translate-y-1/2" 
				/>
			)}
			<span className={loading ? 'ml-6' : ''}>{children}</span>
		</button>
	);
}
