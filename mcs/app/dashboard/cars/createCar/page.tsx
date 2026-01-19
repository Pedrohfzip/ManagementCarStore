"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import carProvider from '@/utils/carsApi';
import { useSelector, useDispatch } from "react-redux";
import { setImageList } from '../../../../redux/slices/carsSlice';


export default function CreateCarPage() {
const [name, setName] = useState("");
const [brand, setBrand] = useState("");
const [year, setYear] = useState("");
const [gas, setGas] = useState("");
const [color, setColor] = useState("");
const [km, setKm] = useState("");
const [photo, setImagem] = useState<File | null>(null);
const [price, setPrice] = useState("");
const [preview, setPreview] = useState<string | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState(false);
const dispatch = useDispatch();
const imageList = useSelector((state: any) => state.cars.imageList);
const router = useRouter();



	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		const currentList = Array.isArray(imageList) ? imageList : [];
		const total = currentList.length + files.length > 10 ? 10 - currentList.length : files.length;
		const filesToAdd = files.slice(0, total);
		console.log(imageList);
		if (filesToAdd.length > 0) {
			dispatch(setImageList(filesToAdd));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(false);
		console.log(preview);
		try {
			const response = await carProvider.createCar(name, brand, Number(year),  imageList, gas, color, Number(km), Number(price));
			if (response?.erro) {
				setError(response.erro);
			} else {
				// setTimeout(() => router.push("/dashboard/cars"), 1200);
			}
		} catch (err: any) {
			setError(err.message || "Erro ao criar carro.");
		} finally {
			setLoading(false);
		}
	};
	console.log(imageList);
	useEffect(() => {
		console.log("imageList atualizado:", imageList);
	}, []);
	return (
		<div className="min-h-screen p-1 flex items-center rounded-lg justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 animate-fadeInLogin px-2 py-8">
			<form
				onSubmit={handleSubmit}
				className="relative  sm:p-6 rounded-3xl  w-full max-w-[380px] flex flex-col gap-6  animate-slideInLogin mx-auto"
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
					<span className="text-zinc-700 font-medium">Combustível</span>
					<input
						type="text"
						className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-zinc-900"
						defaultValue={gas}
						onChange={e => setGas(e.target.value)}
						required
					/>
				</label>

				<label className="flex flex-col gap-1">
					<span className="text-zinc-700 font-medium">Cor</span>
					<input
						type="text"
						className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-zinc-900"
						value={color}
						onChange={e => setColor(e.target.value)}
						required
					/>
				</label>


				   <label className="flex flex-col gap-1">
					   <span className="text-zinc-700 font-medium">KM</span>
					   <input
						   type="number"
						   min="0"
						   className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-zinc-900"
						   value={km}
						   onChange={e => setKm(e.target.value)}
						   required
					   />
				   </label>

				   <label className="flex flex-col gap-1">
					   <span className="text-zinc-700 font-medium">Preço (R$)</span>
					   <input
						   type="number"
						   min="0"
						   step="0.01"
						   className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-zinc-900"
						   value={price}
						   onChange={e => setPrice(e.target.value)}
						   required
					   />
				   </label>

				<label className="flex flex-col gap-1">
					<span className="text-zinc-700 font-medium">Imagens (até 10)</span>
					<input
						type="file"
						accept="image/*"
						multiple
						className="px-2 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-zinc-900"
						onChange={handleImageChange}
						// disabled={Array.isArray(imageList) && imageList.length >= 10}
						key={Array.isArray(imageList) ? imageList.length : 0}
					/>
					{Array.isArray(imageList) && imageList.length > 0 && (
						<div className="mt-2 grid grid-cols-2 gap-2">
							{imageList.map((file: File, idx: number) => (
								<img key={idx} src={URL.createObjectURL(file)} alt={`Pré-visualização ${idx + 1}`} className="rounded-lg shadow w-full h-32 object-cover border border-blue-100" />
							))}
						</div>
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
