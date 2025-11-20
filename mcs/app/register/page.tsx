
'use client';
import { useState } from 'react';
import loginProvider from '@/utils/usersApi';

export default function RegisterPage() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log(name, email, senha);
		const response = await loginProvider.registerUser(email, senha, name);
		console.log(response);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-zinc-100">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm flex flex-col gap-4"
			>
				<h1 className="text-2xl font-bold text-center mb-2">Registrar</h1>
				<label className="flex flex-col gap-1">
					Nome
					<input
						type="text"
						className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						defaultValue={name}
						onChange={e => setName(e.target.value)}
						required
						autoComplete="name"
					/>
				</label>
				<label className="flex flex-col gap-1">
					Email
					<input
						type="email"
						className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						defaultValue={email}
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
						defaultValue={senha}
						onChange={e => setSenha(e.target.value)}
						required
						autoComplete="new-password"
					/>
				</label>
				{error && <div className="text-red-600 text-sm text-center">{error}</div>}
				{success && <div className="text-green-600 text-sm text-center">Registro realizado com sucesso!</div>}
				<button
					type="submit"
					className="bg-blue-600 text-white rounded-full py-2 font-semibold hover:bg-blue-700 transition"
					disabled={loading}
				>
					{loading ? 'Registrando...' : 'Registrar'}
				</button>
			</form>
		</div>
	);
}
