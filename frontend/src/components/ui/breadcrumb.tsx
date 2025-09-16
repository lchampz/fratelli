import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface BreadcrumbItem {
	label: string;
	path?: string;
	icon?: string;
}

interface BreadcrumbProps {
	items?: BreadcrumbItem[];
	className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
	const location = useLocation();
	
	// Gerar breadcrumbs automaticamente se não fornecidos
	const breadcrumbItems = items || (() => {
		const pathSegments = location.pathname.split('/').filter(Boolean);
		const generatedItems: BreadcrumbItem[] = [
			{ label: 'Dashboard', path: '/', icon: '📊' }
		];
		
		pathSegments.forEach((segment, index) => {
			const path = '/' + pathSegments.slice(0, index + 1).join('/');
			let label = segment;
			
			switch (segment) {
				case 'products':
					label = 'Produtos';
					break;
				case 'recipes':
					label = 'Receitas';
					break;
			}
			
			generatedItems.push({
				label,
				path: index === pathSegments.length - 1 ? undefined : path,
				icon: segment === 'products' ? '📦' : segment === 'recipes' ? '🍰' : undefined
			});
		});
		
		return generatedItems;
	})();

	return (
		<nav className={cn('flex items-center space-x-2 text-sm text-amber-700', className)} aria-label="Breadcrumb">
			{breadcrumbItems.map((item, index) => (
				<React.Fragment key={index}>
					{item.path ? (
						<Link
							to={item.path}
							className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
						>
							{item.icon && <span>{item.icon}</span>}
							<span>{item.label}</span>
						</Link>
					) : (
						<span className="flex items-center gap-1 text-gray-900">
							{item.icon && <span>{item.icon}</span>}
							<span>{item.label}</span>
						</span>
					)}
					{index < breadcrumbItems.length - 1 && (
						<span className="text-gray-400">/</span>
					)}
				</React.Fragment>
			))}
		</nav>
	);
}
