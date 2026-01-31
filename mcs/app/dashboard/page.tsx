'use client';



import React, { useEffect, useState, useMemo } from "react";
import userApi from '@/utils/usersApi';
import CarCard from "@/components/CarCard";
import BrandFilterCard from '@/components/BrandFilterCard';
import carsApi from '@/utils/carsApi';

export default function Dashboard() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Inicializa sempre como 'light' para evitar mismatch SSR/CSR
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [cars, setCars] = useState<any[]>([]);
    const [brandFilter, setBrandFilter] = useState<string | null>(null);
    // Marcas populares dos carros cadastrados
    const popularBrands = useMemo(() => {
        console.log(cars);
        const brandCount: Record<string, number> = {};
        if (Array.isArray(cars) && cars.length > 0) {
            cars.forEach(car => {
                const brand = (car.brand || car.marca || "").trim();
                if (brand) brandCount[brand] = (brandCount[brand] || 0) + 1;
            });
        }
        return Object.entries(brandCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([brand]) => brand);
    }, [cars]);

    // Carros filtrados pela marca
    const filteredCars = brandFilter
        ? cars.filter(car => (car.brand === brandFilter || car.marca === brandFilter))
        : cars;


    // Sincroniza tema com localStorage e html após montagem
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedTheme = window.localStorage.getItem('theme');
            if (storedTheme === 'dark') {
                setTheme('dark');
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            document.documentElement.classList.toggle('dark', theme === 'dark');
            window.localStorage.setItem('theme', theme);
        }
    }, [theme]);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                // Tenta renovar o token antes de buscar usuários
                try {
                    await userApi.refreshToken();
                } catch (refreshErr) {
                    // Se falhar, pode ignorar ou tratar logout
                }
                const data = await userApi.getAllUsers();
                setUsers(Array.isArray(data) ? data : []);
            } catch (err: any) {
                setError(err.message || 'Erro ao buscar usuários');
            }
            // Buscar carros do banco
            try {
                const carsData = await carsApi.getAllCars();
                setCars(Array.isArray(carsData) ? carsData : []);
            } catch {
                // Se falhar, apenas não mostra carros
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Estatísticas rápidas
    const stats = [
        {
            label: 'Usuários Ativos',
            value: users.length,
            // icon: (
            //     <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            // ),
        },
        {
            label: 'Carros Cadastrados',
            value: cars.length,
            icon: (
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13l2-2m0 0l7-7 7 7M13 5v6h6" /></svg>
            ),
        },
        // Adicione mais estatísticas se desejar
    ];

    return (
        <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-zinc-100 text-zinc-900'}`}>
            {/* ...botão de tema removido... */}

            <main className="flex-1 w-full pt-28 pb-10 px-2 sm:px-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-8">Dashboard</h1>

                {/* Estatísticas rápidas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                    {stats.map((stat, idx) => (
                        <div key={idx} className={`flex items-center gap-4 rounded-xl shadow p-5 border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-100'}`}>
                            <div className={`flex items-center justify-center rounded-full w-14 h-14 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-blue-50'}`}>
                                {stat.icon}
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="text-sm font-medium" style={{ color: theme === 'dark' ? '#d1d5db' : '#64748b' }}>{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Usuários Ativos */}
                    <section className={`rounded-xl shadow p-6 border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-100'}`}>
                        <h2 className="text-lg font-semibold mb-4">Usuários Ativos</h2>
                        {loading ? (
                            <p className={theme === 'dark' ? 'text-zinc-300' : 'text-zinc-500'}>Carregando usuários...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : users.length === 0 ? (
                            <p className={theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}>Nenhum usuário encontrado.</p>
                        ) : (
                            <ul className="divide-y divide-gray-100 dark:divide-zinc-700">
                                {users.map((user, idx) => (
                                    <li key={user.id || idx} className="py-2 flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg ${theme === 'dark' ? 'bg-zinc-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>{user.name ? user.name[0].toUpperCase() : '?'}</div>
                                        <div>
                                            <div className="font-medium">{user.name || 'Usuário'}</div>
                                            <div className="text-xs" style={{ color: theme === 'dark' ? '#d1d5db' : '#64748b' }}>{user.email || ''}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {/* Carros Cadastrados */}
                    <section className={`rounded-xl shadow p-6 border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-100'}`}>
                        <h2 className="text-lg font-semibold mb-4">Carros Cadastrados</h2>
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
                            <p className={theme === 'dark' ? 'text-zinc-300' : 'text-zinc-500'}>Carregando carros...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : filteredCars.length === 0 ? (
                            <p className={theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}>Nenhum carro encontrado.</p>
                        ) : (
                            <ul className="divide-y divide-gray-100 dark:divide-zinc-700">
                                {filteredCars.map((car, idx) => (
                                    <li key={car.id || idx} className="py-2 flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg ${theme === 'dark' ? 'bg-zinc-900 text-green-300' : 'bg-green-100 text-green-700'}`}>{''}</div>
                                        <div>
                                            <div className="font-medium">{car.name || 'Carro'}</div>
                                            <div className="text-xs" style={{ color: theme === 'dark' ? '#d1d5db' : '#64748b' }}>{car.brand}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}