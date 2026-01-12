
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import carProvider from '@/utils/carsApi';


export default function CreateCarPage() {
	const [name, setName] = useState("");
	const [brand, setBrand] = useState("");
	const [year, setYear] = useState("");
	const [imagem, setImagem] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const router = useRouter();

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		setImagem(file);
		if (file) {
			setPreview(URL.createObjectURL(file));
		} else {
			setPreview(null);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(false);
		try {
			const response = await carProvider.createCar(name, brand, Number(year), imagem);
			if (response?.erro) {
				setError(response.erro);
			} else {
				setSuccess(true);
				setName("");
				setBrand("");
				setYear("");
				setImagem(null);
				setPreview(null);
				setTimeout(() => router.push("/dashboard/cars"), 1200);
			}
		} catch (err: any) {
			setError(err.message || "Erro ao criar carro.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 animate-fadeInLogin px-2 py-8">
			<form
				onSubmit={handleSubmit}
				className="relative bg-white/90 p-4 sm:p-6 rounded-3xl shadow-2xl w-full max-w-[380px] flex flex-col gap-6 border border-blue-100 animate-slideInLogin mx-auto"
				autoComplete="off"
				encType="multipart/form-data"
			>

				<h1 className="text-2xl font-extrabold text-zinc-900 mb-1 tracking-tight">Cadastrar Carro</h1>
				<p className="text-zinc-500 text-sm">Preencha os dados para cadastrar um novo carro.</p>

				<label className="flex flex-col gap-1">
					<span className="text-zinc-700 font-medium">Nome</span>
					<input
						type="text"
						className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-zinc-900"
						value={name}
						onChange={e => setName(e.target.value)}
						required
					/>
				</label>

				<label className="flex flex-col gap-1">
					<span className="text-zinc-700 font-medium">Marca</span>
					<input
						type="text"
						className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-zinc-900"
						value={brand}
						onChange={e => setBrand(e.target.value)}
						required
					/>
				</label>

				<label className="flex flex-col gap-1">
					<span className="text-zinc-700 font-medium">Ano</span>
					<input
						type="number"
						min="1900"
						max={new Date().getFullYear() + 1}
						className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-zinc-900"
						value={year}
						onChange={e => setYear(e.target.value)}
						required
					/>
				</label>

				<label className="flex flex-col gap-1">
					<span className="text-zinc-700 font-medium">Imagem</span>
					<input
						type="file"
						accept="image/*"
						className="px-2 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-zinc-900"
						onChange={handleImageChange}
						required
					/>
					{preview && (
						<img src={preview} alt="Pré-visualização" className="mt-2 rounded-lg shadow w-full h-40 object-cover border border-blue-100" />
					)}
				</label>

				{error && <div className="text-red-600 text-sm text-center animate-fadeInLogin">{error}</div>}
				{success && <div className="text-green-600 text-sm text-center animate-fadeInLogin">Carro cadastrado com sucesso!</div>}

				<button
					type="submit"
					className="mt-2 px-6 py-3 rounded-full bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition-colors text-lg disabled:opacity-60 disabled:cursor-not-allowed"
					disabled={loading}
				>
					{loading ? "Cadastrando..." : "Cadastrar Carro"}
				</button>
			</form>
		</div>
	);
}
