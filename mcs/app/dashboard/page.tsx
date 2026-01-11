'use client';


import React, { useEffect, useState } from "react";
import userApi from '@/utils/usersApi';
import { carros, Car } from "@/components/cars";
import CarCard from "@/components/CarCard";

export default function Dashboard() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUsers() {
            try {
                setLoading(true);
                const data = await userApi.getAllUsers();
                setUsers(Array.isArray(data) ? data : []);
            } catch (err: any) {
                setError(err.message || 'Erro ao buscar usuários');
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
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
            value: carros.length,
            icon: (
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13l2-2m0 0l7-7 7 7M13 5v6h6" /></svg>
            ),
        },
        // Adicione mais estatísticas se desejar
    ];

    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-8">Dashboard</h1>

            {/* Estatísticas rápidas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                {stats.map((stat, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-white rounded-xl shadow p-5 border border-gray-100">
                        <div className="flex items-center justify-center bg-blue-50 rounded-full w-14 h-14">
                            {stat.icon}
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-zinc-900">{stat.value}</div>
                            <div className="text-zinc-500 text-sm font-medium">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Usuários Ativos */}
                <section className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <h2 className="text-lg font-semibold text-zinc-900 mb-4">Usuários Ativos</h2>
                    {loading ? (
                        <p className="text-zinc-500">Carregando usuários...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : users.length === 0 ? (
                        <p className="text-zinc-400">Nenhum usuário encontrado.</p>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {users.map((user, idx) => (
                                <li key={user.id || idx} className="py-2 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                                        {user.nome ? user.nome[0].toUpperCase() : '?'}
                                    </div>
                                    <div>
                                        <div className="font-medium text-zinc-900">{user.nome || 'Usuário'}</div>
                                        <div className="text-xs text-zinc-500">{user.email || ''}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* Carros em Destaque */}
                <section className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <h2 className="text-lg font-semibold text-zinc-900 mb-4">Carros em Destaque</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {carros.map((car) => (
                            <CarCard key={car.id} car={car} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}