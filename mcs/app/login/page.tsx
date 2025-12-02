
'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; 
import Link from 'next/link';
import loginProvider from '@/utils/usersApi';
import { useState } from 'react';
import Notification from '@/components/Notification';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [notif, setNotif] = useState<{message: string, type: "success" | "error"} | null>(null);
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
				setTimeout(() => {
					router.push('/');
				}, 3000);
				
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
		<div className="min-h-screen flex items-center justify-center bg-zinc-100">
			{notif && (
				<Notification
					message={notif.message}
					type={notif.type}
					onClose={() => setNotif(null)}
				/>
			)}
			<form
				onSubmit={handleSubmit}
				className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm flex flex-col gap-4"
			>
				<h1 className="text-2xl font-bold text-center mb-2">Login</h1>
				<label className="flex flex-col gap-1">
					Email
					<input
						type="email"
						className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
						autoComplete="email"
					/>
				</label>
				<label className="flex flex-col gap-1">
					Senha
					<input
						type="password"
						className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={senha}
						onChange={e => setSenha(e.target.value)}
						required
						autoComplete="current-password"
					/>
				</label>
				<button
					type="submit"
					className="bg-blue-600 text-white rounded-full py-2 font-semibold hover:bg-blue-700 transition"
					disabled={loading}
				>
					{loading ? 'Entrando...' : 'Entrar'}
				</button>
				<div className="text-center mt-2 text-sm text-zinc-700">
					Ainda não tem login?{' '}
					<Link href="/register" className="text-blue-600 hover:underline font-semibold">Registre-se</Link>
				</div>
			</form>
		</div>
	);
}
