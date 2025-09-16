import React from 'react';
import { cn } from '../../lib/utils';

type ModalProps = {
	open: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
	className?: string;
};

export function Modal({ open, onClose, title, children, footer, className }: ModalProps) {
	if (!open) return null;
	
	return (
		<div 
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? "modal-title" : undefined}
		>
			<div 
				className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
				onClick={onClose}
				aria-label="Fechar modal"
			/>
			<div className={cn('relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200/50 animate-slide-up', className)}>
				{title && (
					<div className="px-6 py-4 border-b border-gray-200">
						<h3 id="modal-title" className="text-xl font-semibold text-gray-900">
							{title}
						</h3>
					</div>
				)}
				<div className="p-6 text-gray-700">{children}</div>
				{footer && <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">{footer}</div>}
			</div>
		</div>
	);
} 