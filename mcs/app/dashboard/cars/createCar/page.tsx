"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import carProvider from '@/utils/carsApi';
import { useSelector, useDispatch } from "react-redux";
import { setImageList } from '../../../../redux/slices/carsSlice';
import cityProvider from '@/utils/city';
import CitySelect from "@/app/dashboard/cars/createCar/CitySelect";
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

	useEffect(() => {
		const fetchCities = async () => {
			try {
				const cities = await cityProvider.getCities();
				console.log("Cidades disponíveis:", cities);
			} catch (err) {
				console.error("Erro ao buscar cidades:", err);
			}
		};
		fetchCities();
	}, []);


	const [city, setCity] = useState<string>("");

	// setCity is already defined as a state setter above, so you can remove the previous function definition.

	return (
		<div className="min-h-screen p-4 flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white">
			<div className="w-full max-w-3xl">
				<form
					onSubmit={handleSubmit}
					className="relative bg-black/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-blue-100/50 animate-fadeInLogin"
					autoComplete="off"
					encType="multipart/form-data"
				>
					{/* Header */}
					<div className="mb-8 text-center">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-4 shadow-lg">
							{/* <Car className="w-8 h-8 text-white" /> */}
						</div>
						<h1 className="text-3xl font-bold text-white mb-2">Cadastrar Carro</h1>
						<p className="text-zinc-400">Preencha os dados para adicionar um novo veículo ao catálogo</p>
					</div>

					{/* Form Fields */}
					<div className="space-y-6">
						{/* Nome e Marca */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								{/* <Label htmlFor="name" ...> */}
								<label htmlFor="name" className="flex  items-center gap-2 text-white font-medium">
									{/* <Car className="w-4 h-4 text-blue-600" /> */}
									Nome do Veículo
								</label>
								<input
									id="name"
									type="text"
									placeholder="Ex: Civic EX"
									className="bg-blue-50/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg px-4 py-2 w-full"
									value={name}
									onChange={e => setName(e.target.value)}
									required
								/>
							</div>

							<div className="space-y-2">
								<label htmlFor="brand" className="flex items-center gap-2 text-white font-medium">
									{/* <Car className="w-4 h-4 text-blue-600" /> */}
									Marca
								</label>
								<input
									id="brand"
									type="text"
									placeholder="Ex: Honda"
									className="bg-blue-50/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg px-4 py-2 w-full"
									value={brand}
									onChange={e => setBrand(e.target.value)}
									required
								/>
							</div>
						</div>

						{/* Ano, Combustível e Cor */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="space-y-2">
								<label htmlFor="year" className="flex items-center gap-2 text-white font-medium">
									{/* <Calendar className="w-4 h-4 text-blue-600" /> */}
									Ano
								</label>
								<input
									id="year"
									type="number"
									min="1900"
									max={new Date().getFullYear() + 1}
									placeholder="2024"
									className="bg-blue-50/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg px-4 py-2 w-full"
									value={year}
									onChange={e => setYear(e.target.value)}
									required
								/>
							</div>

							<div className="space-y-2">
								<label htmlFor="gas" className="flex items-center gap-2 text-white font-medium">
									{/* <Fuel className="w-4 h-4 text-blue-600" /> */}
									Combustível
								</label>
								<input
									id="gas"
									type="text"
									placeholder="Ex: Gasolina"
									className="bg-blue-50/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg px-4 py-2 w-full"
									value={gas}
									onChange={e => setGas(e.target.value)}
									required
								/>
							</div>

							<div className="space-y-2">
								<label htmlFor="color" className="flex items-center gap-2 text-white font-medium">
									{/* <Palette className="w-4 h-4 text-blue-600" /> */}
									Cor
								</label>
								<input
									id="color"
									type="text"
									placeholder="Ex: Prata"
									className="bg-blue-50/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg px-4 py-2 w-full"
									value={color}
									onChange={e => setColor(e.target.value)}
									required
								/>
							</div>
						</div>

						{/* KM e Preço */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<label htmlFor="km" className="flex items-center gap-2 text-white font-medium">
									{/* <Gauge className="w-4 h-4 text-blue-600" /> */}
									Quilometragem
								</label>
								<input
									id="km"
									type="number"
									min="0"
									placeholder="50000"
									className="bg-blue-50/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg px-4 py-2 w-full"
									value={km}
									onChange={e => setKm(e.target.value)}
									required
								/>
							</div>

							<div className="space-y-2">
								<label htmlFor="price" className="flex items-center gap-2 text-white font-medium">
									{/* <DollarSign className="w-4 h-4 text-blue-600" /> */}
									Preço (R$)
								</label>
								<input
									id="price"
									type="number"
									min="0"
									step="0.01"
									placeholder="75000.00"
									className="bg-blue-50/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg px-4 py-2 w-full"
									value={price}
									onChange={e => setPrice(e.target.value)}
									required
								/>
							</div>
							<div className="space-y-2">
								<CitySelect value={city} onChange={setCity} />
							</div>
						</div>

						{/* Upload de Imagens */}
						<div className="space-y-3">
							<label className="flex items-center gap-2 text-white font-medium">
								{/* <Upload className="w-4 h-4 text-blue-600" /> */}
								Imagens do Veículo
								<span className="text-xs text-zinc-400 font-normal ml-auto">
									{imageList.length}/10 imagens
								</span>
							</label>
							<div className="relative">
								<input
									type="file"
									accept="image/*"
									multiple
									className="hidden"
									id="file-upload"
									onChange={handleImageChange}
									disabled={imageList.length >= 10}
								/>
								<label
									htmlFor="file-upload"
									className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${imageList.length >= 10 ? 'border-zinc-300 bg-zinc-50 cursor-not-allowed' : 'border-blue-300 bg-blue-50/30 hover:bg-blue-100/50 hover:border-blue-400'}`}
								>
									{/* <Upload className={`w-8 h-8 mb-2 ${imageList.length >= 10 ? 'text-zinc-400' : 'text-blue-600'}`} /> */}
									<span className={`text-sm font-medium ${imageList.length >= 10 ? 'text-zinc-400' : 'text-blue-600'}`}>
										{imageList.length >= 10 ? 'Limite atingido' : 'Clique para adicionar imagens'}
									</span>
									<span className="text-xs text-zinc-500 mt-1">PNG, JPG até 10MB cada</span>
								</label>
							</div>

							{/* Preview de Imagens */}
							{imageList.length > 0 && (
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
									{imageList.map((file: File, idx: number) => (
										<div key={idx} className="relative group">
											<img
												src={URL.createObjectURL(file)}
												alt={`Preview ${idx + 1}`}
												className="w-full h-24 object-cover rounded-lg border-2 border-blue-100 shadow-sm"
											/>
											<button
												type="button"
												onClick={() => {
													const newList = [...imageList];
													newList.splice(idx, 1);
													dispatch(setImageList(newList));
												}}
												className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
											>
												{/* <X className="w-4 h-4" /> */}
												×
											</button>
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Mensagens de Erro e Sucesso */}
					{error && (
						<div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm animate-fadeInLogin">
							<div className="flex items-center gap-2">
								<CitySelect value={city} onChange={setCity} />
								{error}
							</div>
						</div>
					)}
					{success && (
						<div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm animate-fadeInLogin">
							<div className="flex items-center gap-2">
								{/* <Check className="w-4 h-4" /> */}
								Carro cadastrado com sucesso!
							</div>
						</div>
					)}

					{/* Botão de Submit */}
					<button
						type="submit"
						className="w-full mt-8 h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all rounded-xl text-white flex items-center justify-center gap-2"
						disabled={loading}
					>
						{loading ? (
							<span className="flex items-center gap-2">
								<span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								Cadastrando...
							</span>
						) : (
							<span className="flex items-center gap-2">
								{/* <Check className="w-5 h-5" /> */}
								Cadastrar Carro
							</span>
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
