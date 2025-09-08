import { useEffect, useMemo, useState } from 'react';
import { useProductsStore } from '../store/products';
import { Button } from '../components/ui/button';
import { useForm, type Resolver, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Modal } from '../components/ui/modal';

const unitOptions = ['mg', 'g', 'kg', 'ml', 'l', 'un'] as const;
const productSchema = z.object({
	name: z.string().min(1, 'Nome é obrigatório'),
	unit: z.enum(unitOptions),
	quantity: z.coerce.number().nonnegative('Quantidade não pode ser negativa').default(0),
});

type ProductForm = z.infer<typeof productSchema>;

type Converted = { grams: number; best: string };

function toGrams(quantity: number, unit: ProductForm['unit']): number {
	switch (unit) {
		case 'kg': return quantity * 1000;
		case 'g': return quantity;
		case 'mg': return quantity / 1000;
		default: return quantity;
	}
}

function formatBestUnit(grams: number): Converted {
	const kg = grams / 1000;
	if (kg >= 1) return { grams, best: `${kg.toFixed(1)} kg` };
	if (grams >= 1) return { grams, best: `${grams.toFixed(1)} g` };
	const mg = grams * 1000;
	return { grams, best: `${mg.toFixed(1)} mg` };
}

export default function ProductsPage() {
	const { items, list, create, update, remove, loading, error } = useProductsStore();
	const resolver = zodResolver(productSchema) as Resolver<ProductForm>;
	const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductForm>({
		resolver,
		defaultValues: { name: 'Farinha', unit: 'g', quantity: 0 },
	});
	const [search, setSearch] = useState('');
	const [open, setOpen] = useState(false);

	useEffect(() => {
		list().catch(() => toast.error('Falha ao carregar produtos'));
	}, [list]);

	const onSubmit: SubmitHandler<ProductForm> = async (data) => {
		try {
			const grams = toGrams(data.quantity, data.unit);
			await create({ name: data.name, quantity: grams });
			toast.success('Produto adicionado');
			reset({ name: '', unit: 'g', quantity: 0 });
			setOpen(false);
		} catch {
			toast.error('Erro ao adicionar produto');
		}
	};

	const onError = () => {
		const first = errors.name?.message || errors.unit?.message || errors.quantity?.message || 'Verifique os campos';
		toast.error(String(first));
	};

	useEffect(() => {
		if (error) toast.error(error);
	}, [error]);

	const filtered = useMemo(() => {
		const term = search.trim().toLowerCase();
		if (!term) return items;
		return items.filter((p) => p.name.toLowerCase().includes(term));
	}, [items, search]);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between gap-3">
				<div className="flex-1">
					<Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nome..." />
				</div>
				<Button variant="secondary" onClick={() => setOpen(true)}>Novo produto</Button>
			</div>

			<Modal open={open} onClose={() => setOpen(false)} title="Cadastrar produto">
				<form onSubmit={handleSubmit(onSubmit, onError)} className="grid grid-cols-1 gap-3">
					<div>
						<label className="block text-sm mb-1">Nome</label>
						<Input {...register('name')} placeholder="Ex.: Farinha" />
						{errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
					</div>
					<div className="grid grid-cols-[1fr_auto] gap-3">
						<div>
							<label className="block text-sm mb-1">Quantidade</label>
							<Input type="number" step="any" {...register('quantity')} />
							{errors.quantity && <p className="text-red-600 text-xs mt-1">{errors.quantity.message}</p>}
						</div>
						<div>
							<label className="block text-sm mb-1">Unidade</label>
							<Select {...register('unit')}>
								{unitOptions.map((u) => (<option key={u} value={u}>{u}</option>))}
							</Select>
							{errors.unit && <p className="text-red-600 text-xs mt-1">{errors.unit.message as string}</p>}
						</div>
					</div>
					<div className="flex justify-end gap-3 mt-2">
						<Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
						<Button type="submit">Salvar</Button>
					</div>
				</form>
			</Modal>

			<div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
				{filtered.map((p: { id: string; name: string; quantity: number }) => {
					const conv = formatBestUnit(p.quantity);
					return (
						<div key={p.id} className="bg-white/10 rounded-xl p-4 border border-white/10 shadow flex flex-col gap-3">
							<div className="flex items-center justify-between">
								<h4 className="font-semibold">{p.name}</h4>
								<span className="text-xs bg-white/20 rounded px-2 py-1">{conv.best}</span>
							</div>
							<div className="text-sm opacity-90">Estoque base (g): <span className="font-semibold">{conv.grams.toFixed(0)}</span></div>
							<div className="flex gap-2">
								<Button variant="ghost" onClick={async () => { try { await update(p.id, { quantity: p.quantity + 100 }); } catch { toast.error('Erro ao atualizar'); } }}>+100 g</Button>
								<Button variant="ghost" onClick={async () => { try { await update(p.id, { quantity: Math.max(0, p.quantity - 100) }); } catch { toast.error('Erro ao atualizar'); } }}>-100 g</Button>
								<Button variant="secondary" onClick={async () => { try { await remove(p.id); toast.success('Produto removido'); } catch { toast.error('Erro ao remover'); } }}>Remover</Button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
} 