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
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/40" onClick={onClose} />
			<div className={cn('relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl', className)}>
				{title && <h3 className="text-lg font-semibold mb-3 text-[#68472B]">{title}</h3>}
				<div className="text-[#68472B]">{children}</div>
				{footer && <div className="mt-4 flex justify-end gap-3">{footer}</div>}
			</div>
		</div>
	);
} 