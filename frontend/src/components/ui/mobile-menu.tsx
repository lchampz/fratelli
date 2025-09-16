import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './button';

interface MobileMenuProps {
	navItems: Array<{ path: string; label: string; icon: string }>;
}

export function MobileMenu({ navItems }: MobileMenuProps) {
	const [isOpen, setIsOpen] = useState(false);
	const location = useLocation();

	return (
		<div className="md:hidden">
			<Button
				variant="ghost"
				size="icon"
				onClick={() => setIsOpen(!isOpen)}
				className="text-gray-700"
			>
				{isOpen ? '✕' : '☰'}
			</Button>
			
			{isOpen && (
				<div className="absolute top-16 left-0 right-0 bg-[#68472B] border-t border-white/10 shadow-lg z-50">
					<div className="p-4 space-y-2">
						{navItems.map((item) => (
							<Link
								key={item.path}
								to={item.path}
								onClick={() => setIsOpen(false)}
								className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
									location.pathname === item.path
										? 'bg-white/20 text-white'
										: 'hover:bg-white/10 text-white/80'
								}`}
							>
								<span className="text-lg">{item.icon}</span>
								<span>{item.label}</span>
							</Link>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
