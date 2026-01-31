
"use client";

import React, { useEffect, useState, useMemo } from "react";
import CarCard from '@/components/CarCard';
import { FaPlus } from "react-icons/fa";
import carsApi from '@/utils/carsApi';
import BrandFilterCard from '@/components/BrandFilterCard';
import CarFilterBar from '@/components/CarFilterBar';



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
			setLoading(true);
			try {
				let params: any = {};
				if (search && !isNaN(Number(search)) && search.length === 4) {
					params.year = search;
				} else if (search) {
					params.name = search;
				}
				if (brandFilter) params.brand = brandFilter;
				let response;
				if (!search && !brandFilter) {
					response = await carsApi.getAllCars();
				} else {
					response = await carsApi.searchCars(params);
				}
				setCars(response);
				setError(null);
			} catch (err) {
				setError('Erro ao buscar carros.');
			} finally {
				setLoading(false);
			}
		}
		fetchCars();
	}, [search, brandFilter]);


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
				{/* ...botão de tema removido... */}
				<div className="flex items-center justify-between mb-8">
					<h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>Carros</h1>
					<a href="/dashboard/cars/createCar" className="flex items-center gap-2 px-5 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors text-base sm:text-lg">
						<FaPlus className="text-xl" />
						Adicionar Carro
					</a>
				</div>

				<div className={`${theme === 'dark' ? 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white' : 'bg-white text-zinc-900'} rounded-2xl shadow-lg p-6  mb-6 w-full overflow-x-auto`}>
				   {/* Filtro de carros como componente */}
				   <CarFilterBar
					   search={search}
					   setSearch={setSearch}
					   brandFilter={brandFilter}
					   setBrandFilter={setBrandFilter}
					   popularBrands={popularBrands}
					   theme={theme}
				   />

					{loading ? (
						<p className="text-zinc-500">Carregando carros...</p>
					) : error ? (
						<p className="text-red-500">{error}</p>
					) : filteredCars.length === 0 ? (
						<p className="text-zinc-400">Nenhum carro encontrado.</p>
					) : (
						<>
							{/* Bloco Desktop: tabela */}
							<div className="hidden sm:block overflow-x-auto">
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
							{/* Bloco Mobile: cards */}
							<div className="block sm:hidden">
								<div className="flex flex-col gap-4">
									{filteredCars.map((car) => (
										<div key={car.id} className={`rounded-xl border border-blue-100 bg-white dark:bg-zinc-800 shadow p-4 flex flex-col gap-2`}>
											<div className="flex items-center gap-3 mb-2">
												<img src={car.images[0]?.imageUrl || "/car-placeholder.png"} className="w-16 h-16 object-cover rounded-lg border border-blue-100" />
												<div>
													<div className="font-semibold text-zinc-800 dark:text-zinc-100 text-base">{car.nome || car.name}</div>
													<div className="text-xs text-zinc-500 dark:text-zinc-300">{car.brand || car.marca} • {car.year || car.ano}</div>
												</div>
											</div>
											<div className="flex items-center gap-2 text-xs mb-2">
												<span className="px-2 py-1 rounded bg-blue-50 text-blue-700 font-semibold">{car.gas || car.combustivel}</span>
												<span className="px-2 py-1 rounded bg-green-50 text-green-700 font-semibold">R$ {Number(car.price || car.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
											</div>
											<div className="flex gap-2">
												<a href={`/dashboard/cars/editCar?id=${car.id}`} className="flex-1 px-3 py-2 rounded bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-bold transition flex items-center justify-center gap-1" title="Editar">Editar</a>
												<button onClick={() => handleDelete(car.id)} className="flex-1 px-3 py-2 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition flex items-center justify-center gap-1" title="Excluir">Excluir</button>
												<a href={`/Car?id=${car.id}`} target="_blank" rel="noopener noreferrer" className="flex-1 px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1" title="Ver Anúncio">Ver</a>
											</div>
										</div>
									))}
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		);
}
