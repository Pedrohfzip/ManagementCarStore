"use client";
import React, { useEffect, useState } from "react";
import userApi from '@/utils/usersApi';
import { FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
import Link from "next/dist/client/link";

export default function UsuariosDashboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

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

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">Usuários</h1>
        <Link href="/dashboard/usuarios/createUser" className="flex items-center gap-2 px-5 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors text-base sm:text-lg">
          <FaUserPlus className="text-xl" />
          Criar Usuário
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 mb-6">
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          className="w-full max-w-md px-4 py-2 rounded-full border border-blue-200 shadow focus:outline-none focus:ring-4 focus:ring-blue-100 text-base transition-all mb-4"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {loading ? (
          <p className="text-zinc-500">Carregando usuários...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-zinc-400">Nenhum usuário encontrado.</p>
        ) : (
          <>
            {/* Tabela para telas médias e grandes */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-blue-100">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase">Nome</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase">Tipo</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-blue-50">
                  {filteredUsers.map((user, idx) => (
                    <tr key={user.id || idx} className="hover:bg-blue-50 transition">
                      <td className="px-4 py-3 font-semibold text-zinc-800">{user.name || user.nome || 'Usuário'}</td>
                      <td className="px-4 py-3">{user.email || ''}</td>
                      <td className="px-4 py-3">{user.role || '-'}</td>
                      <td className="px-4 py-3 flex flex-wrap gap-2">
                        <a href={`/dashboard/usuarios/editUser?id=${user.id}`} className="px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-bold transition flex items-center gap-1" title="Editar">
                          <FaEdit /> Editar
                        </a>
                        <button className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition flex items-center gap-1" title="Excluir">
                          <FaTrash /> Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mini cards para telas pequenas */}
            <div className="sm:hidden flex flex-col gap-4">
              {filteredUsers.map((user, idx) => (
                <div key={user.id || idx} className="rounded-xl border border-blue-100 bg-white shadow p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-700 text-lg">
                      {(user.name || user.nome || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-zinc-800 text-base">{user.name || user.nome || 'Usuário'}</div>
                      <div className="text-xs text-zinc-500">{user.email || ''}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs mb-2">
                    <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 font-semibold">{user.role || '-'}</span>
                  </div>
                  <div className="flex gap-2">
                    <a href={`/dashboard/usuarios/editUser?id=${user.id}`} className="flex-1 px-3 py-2 rounded bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-bold transition flex items-center justify-center gap-1" title="Editar">
                      <FaEdit /> Editar
                    </a>
                    <button className="flex-1 px-3 py-2 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition flex items-center justify-center gap-1" title="Excluir">
                      <FaTrash /> Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
