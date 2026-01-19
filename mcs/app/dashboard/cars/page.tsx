
"use client";

import React, { useEffect, useState, useMemo } from "react";
import CarCard from '@/components/CarCard';
import { FaPlus } from "react-icons/fa";
import carsApi from '@/utils/carsApi';
import BrandFilterCard from '@/components/BrandFilterCard';



export default function CarsDashboardPage() {
	const [cars, setCars] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [brandFilter, setBrandFilter] = useState<string | null>(null);
	const [theme, setTheme] = useState<'light' | 'dark'>(typeof window !== 'undefined' && window.localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');
	// Modal de confirmação
	const [showConfirm, setShowConfirm] = useState(false);
	const [carToDelete, setCarToDelete] = useState<string | null>(null);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			document.documentElement.classList.toggle('dark', theme === 'dark');
			window.localStorage.setItem('theme', theme);
		}
	}, [theme]);

	useEffect(() => {
		async function fetchCars() {
			try {
				const response: any = await carsApi.getAllCars();
				console.log(response);
				setCars(response);
			} catch (err) {
				setError('Erro ao buscar carros.');
			} finally {
				setLoading(false);
			}
		}
		fetchCars();
	}, []);


	// Extrai as marcas populares dos carros carregados
	const popularBrands = useMemo(() => {
		const brandCount: Record<string, number> = {};
		cars?.forEach(car => {
			const brand = (car.brand || car.marca || "").trim();
			if (brand) brandCount[brand] = (brandCount[brand] || 0) + 1;
		});
		// Ordena por frequência e pega as 6 mais populares
		return Object.entries(brandCount)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 6)
			.map(([brand]) => brand);
	}, [cars]);

	const filteredCars = cars.filter((car) => {
		const matchesSearch =
			car.nome?.toLowerCase().includes(search.toLowerCase()) ||
			car.brand?.toLowerCase().includes(search.toLowerCase()) ||
			car.year?.toString().includes(search);
		const matchesBrand = brandFilter ? (car.brand === brandFilter || car.marca === brandFilter) : true;
		return matchesSearch && matchesBrand;
	});

	// Ao clicar em excluir, abre o modal
	function handleDelete(carId: string) {
		setCarToDelete(carId);
		setShowConfirm(true);
	}

	// Confirma exclusão
	async function confirmDelete() {
		if (!carToDelete) return;
		try {
			await carsApi.deleteCar(carToDelete);
			setCars(prev => prev.filter(car => car.id !== carToDelete));
			setShowConfirm(false);
			setCarToDelete(null);
		} catch (e) {
			alert('Erro ao excluir carro.');
			setShowConfirm(false);
			setCarToDelete(null);
		}
	}

		return (
			<div className={`min-h-screen p-4 sm:p-8 w-full max-w-screen overflow-x-hidden overflow-y-auto ${theme === 'dark' ? 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white' : 'bg-gray-50 text-zinc-900'}`}>
				{/* Modal de confirmação de exclusão */}
				{showConfirm && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
						<div className={`rounded-xl shadow-lg p-8 max-w-sm w-full ${theme === 'dark' ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-900'}`}>
							<h2 className="text-lg font-bold mb-4">Confirmar exclusão</h2>
							<p className="mb-6">Tem certeza que deseja excluir este carro? Esta ação não pode ser desfeita.</p>
							<div className="flex justify-end gap-3">
								<button
									className="px-4 py-2 rounded bg-zinc-300 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold hover:bg-zinc-400 dark:hover:bg-zinc-600 transition"
									onClick={() => { setShowConfirm(false); setCarToDelete(null); }}
								>
									Cancelar
								</button>
								<button
									className="px-4 py-2 rounded bg-red-600 text-white font-bold hover:bg-red-700 transition"
									onClick={confirmDelete}
								>
									Excluir
								</button>
							</div>
						</div>
					</div>
				)}
				{/* Botão de tema fixo no canto superior direito */}
				<div style={{ position: 'fixed', top: 16, right: 16, zIndex: 100 }}>
					<button
						onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
						className="flex items-center gap-2 px-3 py-2 rounded-full shadow-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-600 transition hover:scale-100 text-lg"
						aria-label="Alternar modo claro/escuro"
					>
						{theme === 'dark' ? (
							<span className="text-yellow-400 text-xl" role="img" aria-label="Modo escuro">🌙</span>
						) : (
							<span className="text-yellow-400 text-xl" role="img" aria-label="Modo claro">☀️</span>
						)}
					</button>
				</div>
				<div className="flex items-center justify-between mb-8">
					<h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>Carros</h1>
					<a href="/dashboard/cars/createCar" className="flex items-center gap-2 px-5 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors text-base sm:text-lg">
						<FaPlus className="text-xl" />
						Adicionar Carro
					</a>
				</div>

				<div className={`${theme === 'dark' ? 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white' : 'bg-white text-zinc-900'} rounded-2xl shadow-lg p-6  mb-6 w-full max-w-7xl mx-auto overflow-x-auto`}>
					<input
						type="text"
						placeholder="Buscar por nome, marca ou ano..."
						className={`w-full max-w-md px-4 py-2 rounded-full border shadow focus:outline-none focus:ring-4 text-base transition-all mb-2 ${theme === 'dark' ? 'border-zinc-700 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white' : 'border-blue-200 bg-white text-zinc-900 focus:ring-blue-100'}`}
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>

					{/* Cards de filtro de marca */}
					{popularBrands.length > 0 && (
						<div className="flex flex-wrap gap-2 mb-4">
							{popularBrands.map((brand) => (
								<BrandFilterCard
									key={brand}
									brand={brand}
									selected={brandFilter === brand}
									onClick={(b) => setBrandFilter(brandFilter === b ? null : b)}
								/>
							))}
							{brandFilter && (
								<button
									className={`px-3 py-2 rounded-lg border text-xs font-semibold ml-2 ${theme === 'dark' ? 'border-zinc-700 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white' : 'border-blue-200 bg-white text-blue-700'}`}
									onClick={() => setBrandFilter(null)}
									type="button"
								>
									Limpar filtro
								</button>
							)}
						</div>
					)}

					{loading ? (
						<p className="text-zinc-500">Carregando carros...</p>
					) : error ? (
						<p className="text-red-500">{error}</p>
					) : filteredCars.length === 0 ? (
						<p className="text-zinc-400">Nenhum carro encontrado.</p>
					) : (
						<div className="overflow-x-auto">
							<table className={`min-w-full divide-y ${theme === 'dark' ? 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white divide-zinc-700' : 'bg-white divide-blue-100 text-zinc-900'}`}>
								<thead className={`${theme === 'dark' ? 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white' : 'bg-blue-50 text-zinc-900'}`}>
									<tr>
										<th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase">Foto</th>
										<th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase">Nome</th>
										<th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase">Marca</th>
										<th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase">Ano</th>
										<th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase">Combustível</th>
										<th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase">KM</th>
										<th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase">Preço</th>
										<th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase">Ações</th>
									</tr>
								</thead>
								<tbody className={`${theme === 'dark' ? 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white divide-zinc-700' : 'bg-white divide-blue-50 text-zinc-900'}`}>
									{filteredCars.map((car) => (
										<tr key={car.id} className={theme === 'dark' ? 'hover:bg-zinc-800 transition' : 'hover:bg-blue-50 transition'}>
											<td className="px-4 py-3">
												<img src={car.images[0]?.imageUrl || "/car-placeholder.png"} className="w-20 h-14 object-cover rounded-lg border border-blue-100" />
											</td>
											<td className={`px-4 py-3 font-semibold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-800'}`}>{car.nome || car.name}</td>
											<td className={`px-4 py-3 ${theme === 'dark' ? 'text-zinc-100' : ''}`}>{car.brand || car.marca}</td>
											<td className={`px-4 py-3 ${theme === 'dark' ? 'text-zinc-100' : ''}`}>{car.year || car.ano}</td>
											<td className={`px-4 py-3 ${theme === 'dark' ? 'text-zinc-100' : ''}`}>{car.gas || car.combustivel}</td>
											<td className={`px-4 py-3 ${theme === 'dark' ? 'text-zinc-100' : ''}`}>{car.km?.toLocaleString('pt-BR') || '-'}</td>
											<td className={`px-4 py-3 font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>R$ {Number(car.price || car.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
											<td className="px-4 py-3 flex flex-wrap gap-2">
												<a href={`/dashboard/cars/editCar?id=${car.id}`} className="px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-bold transition">Editar</a>
												<button onClick={() => handleDelete(car.id)} className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition">Excluir</button>
												<a href={`/Car?id=${car.id}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition">Ver Anúncio</a>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		);
}
