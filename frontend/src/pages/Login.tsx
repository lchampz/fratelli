import React, { useState } from 'react';
import { useAuthStore } from '../store/auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import WelcomeIllustration from '../components/illustrations/Welcome';

export default function LoginPage() {
	const { login, loading, error } = useAuthStore();
	const [email, setEmail] = useState('admin@fratelli.com');
	const [password, setPassword] = useState('admin123');

	return (
		<div className="mx-auto max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-black/5 bg-[#F6F0E6]/60 backdrop-blur">
			<div className="grid md:grid-cols-2">
				<div className="hidden md:flex flex-col justify-center p-8 bg-gradient-to-br from-[#EAD9C2] to-[#D2B79C]">
					<div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg flex items-center justify-center bg-[#F8F2E8]/70">
						<WelcomeIllustration />
					</div>
					<p className="mt-5 text-[#68472B] text-sm">Bem-vindo à Fratelli Cacau. Sabor artesanal, gestão eficiente.</p>
				</div>
				<div className="p-8">
					<h2 className="text-3xl font-semibold mb-2 tracking-tight text-[#68472B]">Entrar</h2>
					<p className="text-sm text-[#68472B]/70 mb-8">Use suas credenciais para acessar o painel.</p>
					<div className="space-y-4">
						<div>
							<label className="block text-xs font-medium text-[#68472B]/80 mb-1">E-mail</label>
							<Input value={email} onChange={(e) => setEmail(e.target.value)} />
						</div>
						<div>
							<label className="block text-xs font-medium text-[#68472B]/80 mb-1">Senha</label>
							<Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
						</div>
						<div className="flex items-center justify-between text-xs text-[#68472B]/80">
							<label className="inline-flex items-center gap-2"><input type="checkbox" className="accent-[#8B5E3C]" /> Lembrar-me</label>
							<a href="#" className="underline underline-offset-2">Esqueceu a senha?</a>
						</div>
						<Button onClick={() => login(email, password)} disabled={loading} className="w-full bg-[#8B5E3C] hover:bg-[#7a5235]">{loading ? 'Entrando...' : 'Entrar'}</Button>
						{error && <p className="text-red-600 text-sm">{error}</p>}
						<p className="text-[11px] text-[#68472B]/60">Dica: admin@fratelli.com / admin123</p>
						<div className="pt-4 text-xs text-[#68472B]/80">Não tem conta? <a className="underline underline-offset-2" href="#">Inscrever-se</a></div>
					</div>
				</div>
			</div>
		</div>
	);
} 