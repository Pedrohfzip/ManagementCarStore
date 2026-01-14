
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const roles = [
	{ value: "cliente", label: "Cliente" },
	{ value: "administrador", label: "Administrador" },
	{ value: "vendedor", label: "Vendedor" },
	{ value: "vendedor_adm", label: "Vendedor Adm" },
];

export default function CreateUserPage() {
	const [nome, setNome] = useState("");
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [role, setRole] = useState(roles[0].value);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(false);
		try {
			// Chama a API para criar usuário
			const response = await require('@/utils/usersApi').default.registerUser(nome, email, senha, role);
			if (response?.erro) {
				setError(response.erro);
			} else {
				setSuccess(true);
				setNome("");
				setEmail("");
				setSenha("");
				setRole(roles[0].value);
				setTimeout(() => router.push("/dashboard/usuarios"), 1200);
			}
		} catch (err: any) {
			setError(err.message || 'Erro ao criar usuário.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center rounded-lg justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 animate-fadeInLogin p-4">
			<form
				onSubmit={handleSubmit}
				className="relative  p-8 rounded-3xl  w-full max-w-md flex flex-col gap-6  animate-slideInLogin"
				autoComplete="off"
			>
				<h1 className="text-2xl font-extrabold text-zinc-900 mb-1 tracking-tight">Criar Usuário</h1>
				<p className="text-zinc-500 text-sm">Preencha os dados para cadastrar um novo usuário.</p>

				<label className="flex flex-col gap-1">
					<span className="text-zinc-700 font-medium">Nome</span>
					<input
						type="text"
						className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-zinc-900"
						value={nome}
						onChange={e => setNome(e.target.value)}
						required
					/>
				</label>

				<label className="flex flex-col gap-1">
					<span className="text-zinc-700 font-medium">Email</span>
					<input
						type="email"
						className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-zinc-900"
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
					/>
				</label>

				<label className="flex flex-col gap-1">
					<span className="text-zinc-700 font-medium">Senha</span>
					<input
						type="password"
						className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-zinc-900"
						value={senha}
						onChange={e => setSenha(e.target.value)}
						required
					/>
				</label>

				<label className="flex flex-col gap-1">
					<span className="text-zinc-700 font-medium">Tipo de Usuário</span>
					<select
						className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-zinc-900"
						value={role}
						onChange={e => setRole(e.target.value)}
						required
					>
						{roles.map(r => (
							<option key={r.value} value={r.value}>{r.label}</option>
						))}
					</select>
				</label>

				{error && <div className="text-red-600 text-sm text-center animate-fadeInLogin">{error}</div>}
				{success && <div className="text-green-600 text-sm text-center animate-fadeInLogin">Usuário criado com sucesso!</div>}

				<button
					type="submit"
					className="mt-2 px-6 py-3 rounded-full bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition-colors text-lg disabled:opacity-60 disabled:cursor-not-allowed"
					disabled={loading}
				>
					{loading ? "Criando..." : "Criar Usuário"}
				</button>
			</form>
		</div>
	);
}
