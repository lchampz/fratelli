import React from 'react';
import { cn } from '../../lib/utils';

interface AlertProps {
	variant?: 'success' | 'error' | 'warning' | 'info';
	title?: string;
	children: React.ReactNode;
	className?: string;
	onClose?: () => void;
}

export function Alert({ variant = 'info', title, children, className, onClose }: AlertProps) {
	const variants = {
		success: 'bg-green-50 border-green-200 text-green-800',
		error: 'bg-red-50 border-red-200 text-red-800',
		warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
		info: 'bg-blue-50 border-blue-200 text-blue-800',
	};

	return (
		<div
			className={cn(
				'rounded-lg border p-4',
				variants[variant],
				className
			)}
			role="alert"
		>
			<div className="flex items-start justify-between">
				<div className="flex-1">
					{title && (
						<h4 className="font-medium mb-1">{title}</h4>
					)}
					<div className="text-sm">{children}</div>
				</div>
				{onClose && (
					<button
						onClick={onClose}
						className="ml-4 text-current opacity-70 hover:opacity-100"
						aria-label="Fechar alerta"
					>
						×
					</button>
				)}
			</div>
		</div>
	);
}
