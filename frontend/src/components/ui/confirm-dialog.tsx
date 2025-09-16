import React from 'react';
import { Modal } from './modal';
import { Button } from './button';

interface ConfirmDialogProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	variant?: 'danger' | 'warning' | 'info';
	loading?: boolean;
}

export function ConfirmDialog({
	open,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = 'Confirmar',
	cancelText = 'Cancelar',
	variant = 'danger',
	loading = false,
}: ConfirmDialogProps) {
	const handleConfirm = () => {
		onConfirm();
		onClose();
	};

	const buttonVariants = {
		danger: 'bg-red-600 hover:bg-red-700 text-white',
		warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
		info: 'bg-blue-600 hover:bg-blue-700 text-white',
	};

	return (
		<Modal open={open} onClose={onClose} title={title}>
			<div className="space-y-4">
				<p className="text-gray-600">{message}</p>
				<div className="flex justify-end gap-3">
					<Button variant="ghost" onClick={onClose} disabled={loading}>
						{cancelText}
					</Button>
					<Button
						onClick={handleConfirm}
						disabled={loading}
						className={buttonVariants[variant]}
					>
						{loading ? 'Processando...' : confirmText}
					</Button>
				</div>
			</div>
		</Modal>
	);
}
