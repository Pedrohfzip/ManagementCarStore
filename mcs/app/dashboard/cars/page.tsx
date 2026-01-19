
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
		cars.forEach(car => {
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

	// Função para deletar carro (exemplo, ajuste conforme sua API)
	async function handleDelete(carId: string) {
		if (window.confirm('Tem certeza que deseja excluir este carro?')) {
			try {
				await carsApi.deleteCar(carId);
				window.location.reload();
			} catch {
				alert('Erro ao excluir carro.');
			}
		}
	}

		return (
			<div className="p-4 sm:p-8 bg-gray-50 min-h-screen overflow-x-hidden w-full max-w-screen overflow-y-auto">
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">Carros</h1>
				<a href="/dashboard/cars/createCar" className="flex items-center gap-2 px-5 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors text-base sm:text-lg">
					<FaPlus className="text-xl" />
					Adicionar Carro
				</a>
			</div>

			<div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 mb-6 w-full max-w-7xl mx-auto overflow-x-auto">

				<input
						type="text"
						placeholder="Buscar por nome, marca ou ano..."
						className="w-full max-w-md px-4 py-2 rounded-full border border-blue-200 shadow focus:outline-none focus:ring-4 focus:ring-blue-100 text-base transition-all mb-2"
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
								className="px-3 py-2 rounded-lg border border-blue-200 bg-white text-blue-700 text-xs font-semibold ml-2"
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
						<table className="min-w-full divide-y divide-blue-100">
							<thead className="bg-blue-50">
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
							<tbody className="bg-white divide-y divide-blue-50">
								{filteredCars.map((car) => (
									<tr key={car.id} className="hover:bg-blue-50 transition">
										<td className="px-4 py-3">
											<img src={car.photo || car.fotoUrl || "/car-placeholder.png"} alt={car.nome} className="w-20 h-14 object-cover rounded-lg border border-blue-100" />
										</td>
										<td className="px-4 py-3 font-semibold text-zinc-800">{car.nome || car.name}</td>
										<td className="px-4 py-3">{car.brand || car.marca}</td>
										<td className="px-4 py-3">{car.year || car.ano}</td>
										<td className="px-4 py-3">{car.gas || car.combustivel}</td>
										<td className="px-4 py-3">{car.km?.toLocaleString('pt-BR') || '-'}</td>
										<td className="px-4 py-3 text-green-600 font-bold">R$ {Number(car.price || car.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
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
