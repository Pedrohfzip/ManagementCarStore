
"use client";
import React, { useEffect, useState } from "react";
import CarCard from '@/components/CarCard';
import { FaPlus } from "react-icons/fa";
// Importe a API de carros conforme necessário
import carsApi from '@/utils/carsApi';

export default function CarsDashboardPage() {
	const [cars, setCars] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");

	useEffect(() => {
		async function fetchCars() {
			try {
				const response: any = await carsApi.getAllCars();
				setCars(response);
			} catch (err) {
				setError('Erro ao buscar carros.');
			} finally {
				setLoading(false);
			}
		}
		fetchCars();
	}, []);

	const filteredCars = cars.filter(
		(car) =>
			car.nome?.toLowerCase().includes(search.toLowerCase()) ||
			car.brand?.toLowerCase().includes(search.toLowerCase()) ||
			car.year?.toString().includes(search)
	);

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
					className="w-full max-w-md px-4 py-2 rounded-full border border-blue-200 shadow focus:outline-none focus:ring-4 focus:ring-blue-100 text-base transition-all mb-4"
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>

				{loading ? (
					<p className="text-zinc-500">Carregando carros...</p>
				) : error ? (
					<p className="text-red-500">{error}</p>
				) : filteredCars.length === 0 ? (
					<p className="text-zinc-400">Nenhum carro encontrado.</p>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
						{filteredCars.map((car) => (
							<CarCard key={car.id} car={car} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
