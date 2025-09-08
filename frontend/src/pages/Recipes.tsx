import React, { useEffect, useState } from 'react';
import { useRecipesStore } from '../store/recipes';
import { useProductsStore } from '../store/products';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export default function RecipesPage() {
	const { items, list, create, update, remove, prepare, loading } = useRecipesStore();
	const { items: products, list: listProducts } = useProductsStore();
	const [name, setName] = useState('Bolo de Chocolate');
	const [lines, setLines] = useState<Array<{ productId: string; amount: number }>>([]);

	useEffect(() => {
		Promise.all([list(), listProducts()]).catch(() => toast.error('Falha ao carregar dados'));
	}, [list, listProducts]);

	const addLine = () => setLines((s) => [...s, { productId: products[0]?.id ?? '', amount: 0 }]);
	const changeLine = (idx: number, field: 'productId' | 'amount', value: string | number) => {
		setLines((s) => s.map((l, i) => i === idx ? { ...l, [field]: field === 'amount' ? Number(value) : value } : l));
	};

	const onCreate = async () => {
		try {
			await create({ name, ingredients: lines.filter((l) => l.productId) });
			toast.success('Receita criada');
			setName('');
			setLines([]);
		} catch {
			toast.error('Erro ao criar receita');
		}
	};

	return (
		<div className="space-y-6">
			<div className="bg-white/10 rounded-lg p-4 space-y-3">
				<div className="grid md:grid-cols-[1fr_auto] gap-3">
					<input className="rounded-md px-3 py-2 bg-white/90 text-[#68472B]" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome da receita" />
					<Button onClick={addLine}>Adicionar ingrediente</Button>
				</div>
				{lines.map((l, idx) => (
					<div key={idx} className="grid md:grid-cols-[1fr_auto] gap-3 items-center">
						<select className="rounded-md px-3 py-2 bg-white/90 text-[#68472B]" value={l.productId} onChange={(e) => changeLine(idx, 'productId', e.target.value)}>
							<option value="">Selecione um produto</option>
							{products.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
						</select>
						<input type="number" step="any" className="w-28 rounded-md px-3 py-2 bg-white/90 text-[#68472B]" value={l.amount} onChange={(e) => changeLine(idx, 'amount', e.target.value)} placeholder="Qtd" />
					</div>
				))}
				<Button onClick={onCreate} disabled={loading}>Salvar receita</Button>
			</div>

			<div className="grid md:grid-cols-2 gap-4">
				{items.map((r) => (
					<div key={r.id} className="bg-white/10 rounded-lg p-4">
						<div className="flex items-center justify-between mb-2">
							<div className="font-semibold">{r.name}</div>
							<div className="flex gap-2">
								<Button variant="secondary" onClick={async () => { try { await prepare(r.id, 1); toast.success('Receita preparada'); } catch { toast.error('Erro ao preparar'); } }}>Preparar</Button>
								<Button variant="ghost" onClick={async () => { try { await remove(r.id); toast.success('Receita removida'); } catch { toast.error('Erro ao remover'); } }}>Remover</Button>
							</div>
						</div>
						<ul className="text-sm opacity-90 space-y-1">
							{r.ingredients.map((i) => (
								<li key={i.id}>- {products.find((p) => p.id === i.productId)?.name ?? i.productId}: {i.amount}</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</div>
	);
} 