
'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; 
import Link from 'next/link';
import loginProvider from '@/utils/usersApi';
import { useState } from 'react';
import Notification from '@/components/Notification';
import { LoginCarousel } from '@/components/LoginCarousel';
import { Mail, Lock, ArrowRight, Loader2, Car } from 'lucide-react';

import { FaUserCircle } from 'react-icons/fa';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [notif, setNotif] = useState<{ message: string, type: "success" | "error" } | null>(null);
	const [focusField, setFocusField] = useState<'email' | 'senha' | null>(null);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(false);
		try {
			const response: any = await loginProvider.loginUser(email, senha);
			if (response?.erro) {
				setSuccess(false);
				setError(response.erro);
				setNotif({ message: response.erro, type: "error" });
			} else if (response?.message) {
				setError(null);
				setSuccess(true);
				setNotif({ message: response.message, type: "success" });
				// Garante que o loading fique visível por pelo menos 1.2s
				setTimeout(() => {
					router.push('/');
				}, 1200);
			} else {
				setNotif({ message: "Erro desconhecido.", type: "error" });
			}
		} catch (err: any) {
			setNotif({ message: err.message || "Erro ao logar.", type: "error" });
		} finally {
			setLoading(false);
		}
	};

	return (
	<div className="min-h-screen flex flex-col lg:flex-row bg-zinc-950">
			{/* Notificação */}
			{notif && (
				<Notification
					message={notif.message}
					type={notif.type}
					onClose={() => setNotif(null)}
				/>
			)}

			{/* Carrossel - Lado Esquerdo (Desktop) / Topo (Mobile) */}
			<div className="hidden lg:block lg:w-1/2 xl:w-3/5">
				<LoginCarousel />
			</div>

			{/* Formulário de Login - Lado Direito */}
			<div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden">
				{/* Decorative elements - tema automotivo */}
				<div className="absolute top-0 right-0 w-96 h-96 bg-red-900/10 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 left-0 w-96 h-96 bg-zinc-800/30 rounded-full blur-3xl"></div>
				
				{/* Grid pattern overlay */}
				<div className="absolute inset-0 opacity-5">
					<div className="absolute inset-0" style={{
						backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)',
						backgroundSize: '50px 50px'
					}}></div>
				</div>

				{/* Carrossel Mobile - Versão Compacta */}
				<div className="lg:hidden absolute top-0 left-0 right-0 h-48 sm:h-56">
					<LoginCarousel />
				</div>

				{/* Formulário */}
				<div className="w-full max-w-md relative z-10 mt-48 sm:mt-56 lg:mt-0">
					<div className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-800/50 p-8 sm:p-10">
						{/* Header */}
						<div className="text-center mb-8">
							<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl mb-4 shadow-lg shadow-red-900/50">
								<Car className="w-8 h-8 text-white" />
							</div>
							<h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
								Portal AutoPremium
							</h1>
							<p className="text-zinc-400 text-sm sm:text-base">
								Acesse sua conta para gerenciar seu showroom
							</p>
						</div>

						{/* Form */}
						<form onSubmit={handleSubmit} className="space-y-5">
							{/* Email */}
							<div className="space-y-2">
								<label htmlFor="email" className="block text-sm font-semibold text-zinc-300">
									Email
								</label>
								<div className="relative">
									<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
									<input
										id="email"
										type="email"
										className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 bg-zinc-800/50 text-white placeholder:text-zinc-500 ${
											focusField === 'email'
												? 'border-red-600 shadow-lg shadow-red-900/30'
												: 'border-zinc-700/50 hover:border-zinc-600'
										} focus:outline-none`}
										value={email}
										onChange={e => setEmail(e.target.value)}
										onFocus={() => setFocusField('email')}
										onBlur={() => setFocusField(null)}
										required
										autoComplete="email"
										placeholder="seu@email.com"
									/>
								</div>
							</div>

							{/* Senha */}
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<label htmlFor="senha" className="block text-sm font-semibold text-zinc-300">
										Senha
									</label>
									<a href="#" className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors">
										Esqueceu?
									</a>
								</div>
								<div className="relative">
									<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
									<input
										id="senha"
										type="password"
										className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 bg-zinc-800/50 text-white placeholder:text-zinc-500 ${
											focusField === 'senha'
												? 'border-red-600 shadow-lg shadow-red-900/30'
												: 'border-zinc-700/50 hover:border-zinc-600'
										} focus:outline-none`}
										value={senha}
										onChange={e => setSenha(e.target.value)}
										onFocus={() => setFocusField('senha')}
										onBlur={() => setFocusField(null)}
										required
										autoComplete="current-password"
										placeholder="••••••••"
									/>
								</div>
							</div>

							{/* Error Message */}
							{error && (
								<div className="p-3 rounded-lg bg-red-950/50 border border-red-900/50 text-red-400 text-sm">
									{error}
								</div>
							)}

							{/* Submit Button */}
							<button
								type="submit"
								className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl py-3.5 font-semibold text-base shadow-lg shadow-red-900/30 hover:shadow-xl hover:shadow-red-900/40 hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
								disabled={loading}
							>
								{loading ? (
									<>
										<Loader2 className="w-5 h-5 animate-spin" />
										<span>Entrando...</span>
									</>
								) : (
									<>
										<span>Acessar Showroom</span>
										<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
									</>
								)}
							</button>
						</form>

						{/* Footer */}
						<div className="mt-8 text-center">
							<p className="text-sm text-zinc-400">
								Ainda não tem acesso?{' '}
								<a href="/register" className="font-semibold text-red-500 hover:text-red-400 transition-colors">
									Solicite seu cadastro
								</a>
							</p>
						</div>

						{/* Divider */}
						<div className="relative my-8">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-zinc-800"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-4 bg-zinc-900 text-zinc-500">ou acesse com</span>
							</div>
						</div>

						{/* Social Login */}
						<div className="grid grid-cols-2 gap-3">
							<button
								type="button"
								className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all duration-200 font-medium text-zinc-300"
							>
								<svg className="w-5 h-5" viewBox="0 0 24 24">
									<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
									<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
									<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
									<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
								</svg>
								<span className="text-sm">Google</span>
							</button>
							<button
								type="button"
								className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all duration-200 font-medium text-zinc-300"
							>
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 0a12 12 0 1012 12A12 12 0 0012 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 01-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 01.042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 014.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 01.14-.197.35.35 0 01.238-.042l2.906.617a1.214 1.214 0 011.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 00-.231.094.33.33 0 000 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 00.029-.463.33.33 0 00-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 00-.232-.095z"/>
								</svg>
								<span className="text-sm">Reddit</span>
							</button>
						</div>

						{/* Trust badge */}
						<div className="mt-8 flex items-center justify-center gap-2 text-xs text-zinc-500">
							<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
							</svg>
							<span>Conexão segura e criptografada</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
