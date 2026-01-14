
'use client';

import { useState } from 'react';
import loginProvider from '@/utils/usersApi';
import { FaUserPlus } from 'react-icons/fa';
import Notification from '@/components/Notification';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
	const router = useRouter();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [focusField, setFocusField] = useState<'name' | 'email' | 'senha' | null>(null);
	const [notif, setNotif] = useState<{ message: string, type: "success" | "error" } | null>(null);

	type RegisterResponse = {
		erro?: string;
		// add other properties if needed
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(false);
		try {
			const response: RegisterResponse = await loginProvider.registerUser(name, email, senha);
			if (response?.erro) {
				setError(response.erro);
				setNotif({ message: response.erro, type: "error" });
			} else {
				setSuccess(true);
				setNotif({ message: "Registro realizado com sucesso!", type: "success" });
				setName('');
				setEmail('');
				setSenha('');
				// Aguarda 1.2s para mostrar a mensagem de sucesso, depois redireciona para login
				setTimeout(() => {
					router.push('/login');
				}, 1200);
			}
		} catch (err: any) {
			setError(err.message || 'Erro ao registrar.');
			setNotif({ message: err.message || 'Erro ao registrar.', type: "error" });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 animate-fadeInLogin">
			{/* Notification */}

			{/* Loading overlay */}
			{loading && (
				<div style={{
					position: 'fixed',
					inset: 0,
					zIndex: 9999,
					background: 'rgba(219,234,254,0.7)',
					backdropFilter: 'blur(6px)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					transition: 'opacity 0.3s',
				}}>
					<div className="flex flex-col items-center gap-3">
						<span className="loader-login mb-2"></span>
						<span className="text-blue-700 font-semibold animate-fadeInLogin">Registrando...</span>
					</div>
				</div>
			)}
			<form
				onSubmit={handleSubmit}
				className="relative bg-white/90 p-8 rounded-3xl shadow-2xl w-full max-w-md flex flex-col gap-6 border border-blue-100 animate-slideInLogin"
				style={{ backdropFilter: 'blur(8px)' }}
			>
				<div className="flex flex-col items-center mb-2">
					<span className="bg-blue-100 p-4 rounded-full mb-2 animate-popIn">
						<FaUserPlus className="text-blue-600 text-4xl drop-shadow" />
					</span>
					<h1 className="text-3xl font-extrabold text-zinc-900 mb-1 tracking-tight animate-fadeInLogin">Crie sua conta</h1>
					<p className="text-zinc-500 text-sm animate-fadeInLogin">Preencha os dados para se registrar</p>
				</div>
				<label className="flex flex-col gap-1 animate-fadeInLogin">
					<span className="font-semibold text-zinc-700">Nome</span>
					<input
						type="text"
						className={`border-2 rounded-xl px-4 py-2 focus:outline-none transition-all duration-200 ${focusField === 'name' ? 'border-blue-500 shadow-lg' : 'border-zinc-200'}`}
						value={name}
						onChange={e => setName(e.target.value)}
						onFocus={() => setFocusField('name')}
						onBlur={() => setFocusField(null)}
						required
						autoComplete="name"
						placeholder="Seu nome completo"
					/>
				</label>
				<label className="flex flex-col gap-1 animate-fadeInLogin">
					<span className="font-semibold text-zinc-700">Email</span>
					<input
						type="email"
						className={`border-2 rounded-xl px-4 py-2 focus:outline-none transition-all duration-200 ${focusField === 'email' ? 'border-blue-500 shadow-lg' : 'border-zinc-200'}`}
						value={email}
						onChange={e => setEmail(e.target.value)}
						onFocus={() => setFocusField('email')}
						onBlur={() => setFocusField(null)}
						required
						autoComplete="email"
						placeholder="seu@email.com"
					/>
				</label>
				<label className="flex flex-col gap-1 animate-fadeInLogin">
					<span className="font-semibold text-zinc-700">Senha</span>
					<input
						type="password"
						className={`border-2 rounded-xl px-4 py-2 focus:outline-none transition-all duration-200 ${focusField === 'senha' ? 'border-blue-500 shadow-lg' : 'border-zinc-200'}`}
						value={senha}
						onChange={e => setSenha(e.target.value)}
						onFocus={() => setFocusField('senha')}
						onBlur={() => setFocusField(null)}
						required
						autoComplete="new-password"
						placeholder="Crie uma senha"
					/>
				</label>
				{error && <div className="text-red-600 text-sm text-center animate-fadeInLogin">{error}</div>}
				{success && <div className="text-green-600 text-sm text-center animate-fadeInLogin">Registro realizado com sucesso!</div>}
				<button
					type="submit"
					className="bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-full py-2 font-bold text-lg shadow hover:scale-105 hover:from-blue-700 hover:to-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
					disabled={loading}
				>
					{loading ? 'Registrando...' : 'Registrar'}
				</button>
			</form>
			<style jsx global>{`
				@keyframes fadeInLogin {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				.animate-fadeInLogin {
					animation: fadeInLogin 0.7s cubic-bezier(.4,0,.2,1);
				}
				@keyframes slideInLogin {
					from { opacity: 0; transform: translateX(60px) scale(0.98); }
					to { opacity: 1; transform: translateX(0) scale(1); }
				}
				.animate-slideInLogin {
					animation: slideInLogin 0.7s cubic-bezier(.4,0,.2,1);
				}
				@keyframes popIn {
					0% { transform: scale(0.7); opacity: 0; }
					80% { transform: scale(1.1); opacity: 1; }
					100% { transform: scale(1); }
				}
				.animate-popIn {
					animation: popIn 0.6s cubic-bezier(.4,0,.2,1);
				}
				.loader-login {
					width: 44px;
					height: 44px;
					border: 5px solid #3b82f6;
					border-top: 5px solid #e0e7ef;
					border-radius: 50%;
					animation: spinLogin 0.8s linear infinite;
				}
				@keyframes spinLogin {
					0% { transform: rotate(0deg); }
					100% { transform: rotate(360deg); }
				}
			`}</style>
		</div>
	);
}
