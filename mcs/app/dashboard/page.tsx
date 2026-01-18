'use client';



import React, { useEffect, useState } from "react";
import userApi from '@/utils/usersApi';
import CarCard from "@/components/CarCard";
import carsApi from '@/utils/carsApi';

export default function Dashboard() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [theme, setTheme] = useState<'light' | 'dark'>(typeof window !== 'undefined' && window.localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');
    const [cars, setCars] = useState<any[]>([]);

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
            icon: (
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ),
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
            {/* Botão de tema flutuante colado à direita */}
            <div className="fixed top-20 right-2 z-50">
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="flex items-center gap-2 px-3 py-2 rounded-full shadow-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-600 transition hover:scale-100 text-lg"
                    aria-label="Alternar modo claro/escuro"
                >
                    {theme === 'dark' ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 19.5V21M4.219 4.219l1.061 1.061M17.657 17.657l1.061 1.061M3 12h1.5M19.5 12H21M4.219 19.781l1.061-1.061M17.657 6.343l1.061-1.061M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                            </svg>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0112 21.75c-5.385 0-9.75-4.365-9.75-9.75 0-4.136 2.635-7.64 6.348-9.123a.75.75 0 01.908.37.75.75 0 01-.082.988A7.501 7.501 0 0012 19.5a7.48 7.48 0 006.516-3.574.75.75 0 01.988-.082.75.75 0 01.37.908z" />
                            </svg>
                        </>
                    )}
                </button>
            </div>

            <main className="flex-1 w-full max-w-7xl mx-auto pt-28 pb-10 px-2 sm:px-6">
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
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg ${theme === 'dark' ? 'bg-zinc-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>{user.nome ? user.nome[0].toUpperCase() : '?'}</div>
                                        <div>
                                            <div className="font-medium">{user.nome || 'Usuário'}</div>
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
                        {loading ? (
                            <p className={theme === 'dark' ? 'text-zinc-300' : 'text-zinc-500'}>Carregando carros...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : cars.length === 0 ? (
                            <p className={theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}>Nenhum carro encontrado.</p>
                        ) : (
                            <ul className="divide-y divide-gray-100 dark:divide-zinc-700">
                                {cars.map((car, idx) => (
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