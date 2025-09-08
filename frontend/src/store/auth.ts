import { create } from 'zustand';
import { api, setAuthToken } from '../lib/api';
import type { User } from '../types';

type AuthState = {
	token: string | null;
	user: User | null;
	loading: boolean;
	error: string | null;
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string) => Promise<void>;
	logout: () => void;
	fetchMe: () => Promise<void>;
};

const initialToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
if (initialToken) setAuthToken(initialToken);

export const useAuthStore = create<AuthState>((set, get) => ({
	token: initialToken,
	user: null,
	loading: false,
	error: null,
	async login(email, password) {
		set({ loading: true, error: null });
		try {
			const { data } = await api.post('/auth/login', { email, password });
			setAuthToken(data.token);
			localStorage.setItem('auth_token', data.token);
			set({ token: data.token, user: data.user, loading: false });
		} catch (e: any) {
			set({ error: e?.response?.data?.message ?? 'Login failed', loading: false });
		}
	},
	async register(email, password) {
		set({ loading: true, error: null });
		try {
			await api.post('/auth/register', { email, password });
			await get().login(email, password);
		} catch (e: any) {
			set({ error: e?.response?.data?.message ?? 'Register failed', loading: false });
		}
	},
	logout() {
		setAuthToken(null);
		localStorage.removeItem('auth_token');
		set({ token: null, user: null });
	},
	async fetchMe() {
		try {
			const { data } = await api.get('/auth/me');
			set({ user: data.user });
		} catch {
			set({ token: null, user: null });
		}
	},
})); 