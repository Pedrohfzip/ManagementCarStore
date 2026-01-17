"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import carsApi from '@/utils/carsApi';

export default function EditCarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [car, setCar] = useState(null);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [year, setYear] = useState("");
  const [gas, setGas] = useState("");
  const [color, setColor] = useState("");
  const [km, setKm] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchCar() {
      if (!id) return;
      setLoading(true);
      try {
        const data = await carsApi.getCarById(id);
        setCar(data);
        setName(data.nome || data.name || "");
        setBrand(data.brand || data.marca || "");
        setYear(data.year || data.ano || "");
        setGas(data.gas || data.combustivel || "");
        setColor(data.color || data.cor || "");
        setKm(data.km ? String(data.km) : "");
        setPrice(data.price ? String(data.price) : data.preco ? String(data.preco) : "");
        setPreview(data.photo || data.fotoUrl || "");
      } catch (err) {
        setError("Erro ao buscar dados do carro.");
      } finally {
        setLoading(false);
      }
    }
    fetchCar();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setPhoto(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await carsApi.editCar(id, {
        name: name,
        brand: brand,
        year: Number(year),
        gas: gas,
        color: color,
        km: Number(km),
        price: Number(price),
        photo: photo,
      });
      if (response && response.erro) {
        setError(response.erro);
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard/cars"), 1200);
      }
    } catch (err) {
      setError(err && err.message ? err.message : "Erro ao editar carro.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !car) {
    return <div className="p-8 text-center">Carregando...</div>;
  }
  if (error && !car) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen p-1 flex items-center rounded-lg justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 animate-fadeInLogin px-2 py-8">
      <form
        onSubmit={handleSubmit}
        className="relative sm:p-6 rounded-3xl w-full max-w-[380px] flex flex-col gap-6 animate-slideInLogin mx-auto"
        autoComplete="off"
        encType="multipart/form-data"
      >
        <h1 className="text-2xl font-extrabold text-zinc-900 mb-1 tracking-tight">Editar Carro</h1>
        <p className="text-zinc-500 text-sm">Altere os dados do carro e salve as mudanças.</p>

        <label className="flex flex-col gap-1">
          <span className="text-zinc-700 font-medium">Nome</span>
          <input
            type="text"
            className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-zinc-900"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-zinc-700 font-medium">Marca</span>
          <input
            type="text"
            className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-zinc-900"
            value={brand}
            onChange={e => setBrand(e.target.value)}
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-zinc-700 font-medium">Ano</span>
          <input
            type="number"
            min="1900"
            max={new Date().getFullYear() + 1}
            className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-zinc-900"
            value={year}
            onChange={e => setYear(e.target.value)}
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-zinc-700 font-medium">Combustível</span>
          <input
            type="text"
            className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-zinc-900"
            value={gas}
            onChange={e => setGas(e.target.value)}
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-zinc-700 font-medium">Cor</span>
          <input
            type="text"
            className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-zinc-900"
            value={color}
            onChange={e => setColor(e.target.value)}
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-zinc-700 font-medium">KM</span>
          <input
            type="number"
            min="0"
            className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-zinc-900"
            value={km}
            onChange={e => setKm(e.target.value)}
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-zinc-700 font-medium">Preço (R$)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            className="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-zinc-900"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-zinc-700 font-medium">Imagem</span>
          <input
            type="file"
            accept="image/*"
            className="px-2 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-zinc-900"
            onChange={handleImageChange}
          />
          {preview && (
            <img src={preview} alt="Pré-visualização" className="mt-2 rounded-lg shadow w-full h-40 object-cover border border-blue-100" />
          )}
        </label>

        {error && <div className="text-red-600 text-sm text-center animate-fadeInLogin">{error}</div>}
        {success && <div className="text-green-600 text-sm text-center animate-fadeInLogin">Carro editado com sucesso!</div>}

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
