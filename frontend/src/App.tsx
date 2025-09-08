import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import { Button } from './components/ui/button';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/Products';
import RecipesPage from './pages/Recipes';
import LoginPage from './pages/Login';
import { Toaster } from 'sonner';

function PrivateRoute({ children }: { children: React.ReactNode }) {
	const token = useAuthStore((s) => s.token);
	if (!token) return <Navigate to="/login" replace />;
	return <>{children}</>;
}

function Shell({ children }: { children: React.ReactNode }) {
	const { logout, user } = useAuthStore();
	const location = useLocation();
	const isLogin = location.pathname === '/login';
	return (
		<div className={isLogin ? 'min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100 text-[#2A2730]' : 'min-h-screen bg-[#68472B] text-[rgba(255,255,255,0.85)]'}>
			<div className={isLogin ? 'mx-auto p-6 min-h-screen flex items-center justify-center' : 'max-w-6xl mx-auto p-6'}>
				{!isLogin && (
					<header className="mb-8 flex items-center justify-between">
						<nav className="flex gap-4 items-center">
							<Link to="/" className="font-bold">Fratelli</Link>
							<Link to="/products">Produtos</Link>
							<Link to="/recipes">Receitas</Link>
						</nav>
						<div className="flex items-center gap-3">
							{user && <span className="text-sm opacity-90">{user.email}</span>}
							{user ? (
								<Button variant="ghost" onClick={logout}>Sair</Button>
							) : (
								<Link to="/login">Entrar</Link>
							)}
						</div>
					</header>
				)}
				{children}
			</div>
		</div>
	);
}

export default function App() {
	return (
		<BrowserRouter>
			<Toaster richColors position="top-right" />
			<Shell>
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
					<Route path="/products" element={<PrivateRoute><ProductsPage /></PrivateRoute>} />
					<Route path="/recipes" element={<PrivateRoute><RecipesPage /></PrivateRoute>} />
				</Routes>
			</Shell>
		</BrowserRouter>
	);
} 