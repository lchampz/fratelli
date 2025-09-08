import React, { useEffect } from 'react';
import { useReportsStore } from '../store/reports';
import { toast } from 'sonner';

export default function Dashboard() {
	const { stock, capability, history, fetchStock, fetchCapability, fetchHistory, loading } = useReportsStore();

	useEffect(() => {
		Promise.all([fetchStock(), fetchCapability(), fetchHistory()]).catch(() => toast.error('Falha ao carregar dashboard'));
	}, [fetchStock, fetchCapability, fetchHistory]);

	return (
		<div className="space-y-6">
			<section className="grid md:grid-cols-3 gap-4">
				<div className="bg-white/10 rounded-lg p-4">
					<h3 className="font-semibold mb-2">Estoque (itens)</h3>
					<ul className="text-sm space-y-1 max-h-64 overflow-auto">
						{stock.map((p) => (
							<li key={p.id} className="flex justify-between">
								<span>{p.name}</span>
								<span className="opacity-80">{p.quantity} {p.unit}</span>
							</li>
						))}
					</ul>
				</div>
				<div className="bg-white/10 rounded-lg p-4">
					<h3 className="font-semibold mb-2">Capacidade</h3>
					<ul className="text-sm space-y-1 max-h-64 overflow-auto">
						{capability.map((c) => (
							<li key={c.recipeId} className="flex justify-between">
								<span>{c.name}</span>
								<span className="opacity-80">{c.possible}x</span>
							</li>
						))}
					</ul>
				</div>
				<div className="bg-white/10 rounded-lg p-4">
					<h3 className="font-semibold mb-2">Histórico</h3>
					<ul className="text-sm space-y-1 max-h-64 overflow-auto">
						{history.map((h) => (
							<li key={h.id}>
								<span className="opacity-80">[{new Date(h.createdAt).toLocaleString()}]</span> {h.amount} {h.product.unit} - {h.product.name} ({h.reason})
							</li>
						))}
					</ul>
				</div>
			</section>
			{loading && <p className="opacity-80">Carregando...</p>}
		</div>
	);
} 