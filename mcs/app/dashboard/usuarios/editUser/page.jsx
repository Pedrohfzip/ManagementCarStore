"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import usersApi from '@/utils/usersApi';

const roles = [
  { value: "cliente", label: "Cliente" },
  { value: "administrador", label: "Administrador" },
  { value: "vendedor", label: "Vendedor" },
  { value: "vendedor_adm", label: "Vendedor Adm" },
];

export default function EditUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState(roles[0].value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      if (!id) return;
      setLoading(true);
      try {
        const data = await usersApi.getUserById(id);
        setNome(data.nome || "");
        setEmail(data.email || "");
        setRole(data.role || roles[0].value);
      } catch (err) {
        setError("Erro ao buscar dados do usuário.");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await usersApi.editUser(id, { nome, email, senha, role });
      if (response && response.erro) {
        setError(response.erro);
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard/usuarios"), 1200);
      }
    } catch (err) {
      setError(err && err.message ? err.message : "Erro ao editar usuário.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !nome) {
    return <div className="p-8 text-center">Carregando...</div>;
  }
  if (error && !nome) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen flex items-center rounded-lg justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 animate-fadeInLogin p-4">
      <form
        onSubmit={handleSubmit}
        className="relative p-8 rounded-3xl w-full max-w-md flex flex-col gap-6 animate-slideInLogin"
        autoComplete="off"
      >
        <h1 className="text-2xl font-extrabold text-zinc-900 mb-1 tracking-tight">Editar Usuário</h1>
        <p className="text-zinc-500 text-sm">Altere os dados do usuário e salve as mudanças.</p>

        <label className="flex flex-col gap-1">
          <span className="text-zinc-700 font-medium">Nome</span>
          <input
            type="text"
            className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-zinc-900"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-zinc-700 font-medium">Email</span>
          <input
            type="email"
            className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-zinc-900"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-zinc-700 font-medium">Senha (opcional)</span>
          <input
            type="password"
            className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-zinc-900"
            value={senha}
            onChange={e => setSenha(e.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-zinc-700 font-medium">Tipo de Usuário</span>
          <select
            className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-zinc-900"
            value={role}
            onChange={e => setRole(e.target.value)}
            required
          >
            {roles.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </label>

        {error && <div className="text-red-600 text-sm text-center animate-fadeInLogin">{error}</div>}
        {success && <div className="text-green-600 text-sm text-center animate-fadeInLogin">Usuário editado com sucesso!</div>}

        <button
          type="submit"
          className="mt-2 px-6 py-3 rounded-full bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition-colors text-lg disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar Alterações"}
        </button>
      </form>
    </div>
  );
}
