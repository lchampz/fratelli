import { create } from 'zustand';
import { api } from '../lib/api';
import type { Recipe } from '../types';

type RecipesState = {
	items: Recipe[];
	loading: boolean;
	error: string | null;
	list: () => Promise<void>;
	create: (payload: { name: string; ingredients: Array<{ productId: string; amount: number }> }) => Promise<void>;
	update: (id: string, payload: Partial<{ name: string; ingredients: Array<{ productId: string; amount: number }> }>) => Promise<void>;
	remove: (id: string) => Promise<void>;
	prepare: (id: string, qty?: number) => Promise<void>;
};

export const useRecipesStore = create<RecipesState>((set, get) => ({
	items: [],
	loading: false,
	error: null,
	async list() {
		set({ loading: true });
		try {
			const { data } = await api.get<Recipe[]>('/recipes');
			set({ items: data, loading: false });
		} catch (e: any) {
			set({ error: e?.response?.data?.message ?? 'Failed to fetch recipes', loading: false });
		}
	},
	async create(payload) {
		await api.post('/recipes', payload);
		await get().list();
	},
	async update(id, payload) {
		await api.put(`/recipes/${id}`, payload);
		await get().list();
	},
	async remove(id) {
		await api.delete(`/recipes/${id}`);
		await get().list();
	},
	async prepare(id, qty = 1) {
		await api.post(`/recipes/${id}/prepare`, null, { params: { qty } });
		await get().list();
	},
})); 