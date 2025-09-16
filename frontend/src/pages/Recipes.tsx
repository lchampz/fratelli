import React, { useEffect, useState } from 'react';
import { useRecipesStore } from '../store/recipes';
import { useProductsStore } from '../store/products';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Modal } from '../components/ui/modal';
import { RecipeCalculator } from '../components/ui/recipe-calculator';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { useForm, type Resolver, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

const recipeSchema = z.object({
	name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
	ingredients: z.array(z.object({
		productId: z.string().min(1, 'Produto é obrigatório'),
		amount: z.coerce.number().positive('Quantidade deve ser positiva')
	})).min(1, 'Receita deve ter pelo menos um ingrediente')
});

type RecipeForm = z.infer<typeof recipeSchema>;

export default function RecipesPage() {
	const { items, list, create, remove, prepare, loading } = useRecipesStore();
	const { items: products, list: listProducts } = useProductsStore();
	const [open, setOpen] = useState(false);
	const [lines, setLines] = useState<Array<{ productId: string; amount: number }>>([]);
	const [isLoading, setIsLoading] = useState(true);

	const resolver = zodResolver(recipeSchema) as Resolver<RecipeForm>;
	const { register, handleSubmit, reset, formState: { errors } } = useForm<RecipeForm>({
		resolver,
		defaultValues: { 
			name: '', 
			ingredients: [{ productId: '', amount: 0 }] 
		}
	});

	useEffect(() => {
		const loadData = async () => {
			try {
				setIsLoading(true);
				// Carregar produtos primeiro
				await listProducts();
				// Depois carregar receitas
				await list();
			} catch {
				toast.error('Falha ao carregar dados');
			} finally {
				setIsLoading(false);
			}
		};
		
		loadData();
	}, [list, listProducts]);

	const addLine = () => {
		if (products.length === 0) {
			toast.error('Nenhum produto disponível. Adicione produtos primeiro.');
			return;
		}
		setLines((s) => [
			...s,
			{ productId: Array.isArray(products) ? (products[0]?.id ?? '') : '', amount: 0 }
		]);
	};
	const removeLine = (idx: number) => setLines((s) => s.filter((_, i) => i !== idx));
	const changeLine = (idx: number, field: 'productId' | 'amount', value: string | number) => {
		setLines((s) => s.map((l, i) => i === idx ? { ...l, [field]: field === 'amount' ? Number(value) : value } : l));
	};

	const onSubmit: SubmitHandler<RecipeForm> = async (data) => {
		try {
			await create({ name: data.name, ingredients: lines.filter((l) => l.productId) });
			toast.success('Receita criada');
			reset();
			setLines([]);
			setOpen(false);
		} catch {
			toast.error('Erro ao criar receita');
		}
	};

	const onError = () => {
		toast.error('Verifique os dados da receita');
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Receitas</h1>
					<p className="text-gray-600">Gerencie suas receitas e ingredientes</p>
				</div>
				<Button 
					onClick={() => {
						if (products.length === 0) {
							toast.error('Nenhum produto disponível. Adicione produtos primeiro.');
							return;
						}
						reset();
						setLines([{ productId: products[0]?.id ?? '', amount: 0 }]);
						setOpen(true);
					}}
					className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
				>
					+ Nova Receita
				</Button>
			</div>

			{/* Calculadora de Receitas */}
			<div className="mb-8">
				<RecipeCalculator />
			</div>

			{/* Modal de Criação */}
			<Modal open={open} onClose={() => setOpen(false)} title="Criar Nova Receita">
				<form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Nome da Receita</label>
						<Input 
							{...register('name')} 
							placeholder="Ex.: Bolo de Chocolate" 
							className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
						/>
						{errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-3">Ingredientes</label>
						<div className="space-y-3">
							{lines.map((l, idx) => (
								<div key={idx} className="flex gap-3 items-center p-3 bg-gray-50 rounded-xl">
									<div className="flex-1">
										<Select 
											value={l.productId} 
											onChange={(e) => changeLine(idx, 'productId', e.target.value)}
											className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										>
											<option value="">Selecione um produto</option>
											{Array.isArray(products) && products.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
										</Select>
									</div>
									<div className="w-24">
										<Input 
											type="number" 
											step="any" 
											value={l.amount} 
											onChange={(e) => changeLine(idx, 'amount', e.target.value)} 
											placeholder="Qtd (g)"
											className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										/>
									</div>
									<Button 
										type="button" 
										variant="ghost" 
										onClick={() => removeLine(idx)}
										className="w-10 h-10 rounded-lg hover:bg-red-100 hover:text-red-600"
									>
										×
									</Button>
								</div>
							))}
						</div>
						<Button 
							type="button" 
							variant="secondary" 
							onClick={addLine} 
							className="mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
						>
							+ Adicionar Ingrediente
						</Button>
						{errors.ingredients && <p className="text-red-600 text-sm mt-2">{errors.ingredients.message}</p>}
					</div>

					<div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
						<Button 
							type="button" 
							variant="ghost" 
							onClick={() => setOpen(false)}
							className="px-6 py-2 text-gray-600 hover:text-gray-800"
						>
							Cancelar
						</Button>
						<Button 
							type="submit" 
							disabled={loading}
							className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
						>
							{loading ? 'Salvando...' : 'Salvar Receita'}
						</Button>
					</div>
				</form>
			</Modal>

			{/* Lista de Receitas */}
			{isLoading ? (
				<div className="flex items-center justify-center py-12">
					<LoadingSpinner size="lg" />
					<span className="ml-3 text-lg text-gray-600">Carregando receitas...</span>
				</div>
			) : (
				<>
					<div className="grid lg:grid-cols-2 gap-6">
						{Array.isArray(items) && items.map((r) => (
							<div key={r.id} className="card card-hover p-6">
								<div className="flex items-start justify-between mb-4">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-lg">
											🍰
										</div>
										<div>
											<h3 className="text-lg font-semibold text-gray-900">{r.name}</h3>
											<p className="text-sm text-gray-600">{r.ingredients.length} ingredientes</p>
										</div>
									</div>
									<div className="flex gap-2">
										<Button 
											variant="secondary" 
											onClick={async () => { 
												try { 
													await prepare(r.id, 1); 
													toast.success('Receita preparada com sucesso!'); 
												} catch { 
													toast.error('Erro ao preparar receita'); 
												} 
											}}
											className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-lg text-sm"
										>
											Preparar
										</Button>
										<Button 
											variant="ghost" 
											onClick={async () => { 
												try { 
													await remove(r.id); 
													toast.success('Receita removida'); 
												} catch { 
													toast.error('Erro ao remover receita'); 
												} 
											}}
											className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg text-sm"
										>
											Remover
										</Button>
									</div>
								</div>
								
								<div className="space-y-2">
									<h4 className="text-sm font-medium text-gray-700 mb-2">Ingredientes:</h4>
									<ul className="space-y-1">
										{r.ingredients.map((i) => {
											const product = Array.isArray(products) ? products.find((p) => p.id === i.productId) : null;
											return (
												<li key={i.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-lg">
													<span className="text-gray-900">
														{product?.name || 'Produto não encontrado'}
													</span>
													<span className="font-medium text-gray-600">{i.amount}g</span>
												</li>
											);
										})}
									</ul>
								</div>
							</div>
						))}
					</div>

					{Array.isArray(items) && items.length === 0 && (
						<div className="text-center py-12">
							<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-2xl">🍰</span>
							</div>
							<h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma receita cadastrada</h3>
							<p className="text-gray-600 mb-4">Comece criando sua primeira receita</p>
							<Button 
								onClick={() => {
									if (products.length === 0) {
										toast.error('Nenhum produto disponível. Adicione produtos primeiro.');
										return;
									}
									reset();
									setLines([{ productId: products[0]?.id ?? '', amount: 0 }]);
									setOpen(true);
								}}
								className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
							>
								Criar Primeira Receita
							</Button>
						</div>
					)}
				</>
			)}
		</div>
	);
} 