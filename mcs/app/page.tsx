
"use client";
import { useState,useEffect } from "react";
import Header from "../components/Header";
import { carros, Car } from "../components/cars";
import CarCard from "../components/CarCard";
import usersApi from "@/utils/usersApi";
export default function Home() {
  const [busca, setBusca] = useState("");
  const [authenticate, setAuthenticate] = useState<any>({});

  const carrosFiltrados = carros.filter((car) =>
    car.nome.toLowerCase().includes(busca.toLowerCase())
  );

  useEffect(() => {
    async function fetchAuthenticatedUser() {
      try {
        const user: any = await usersApi.getAuthenticatedUser();
        if (user.erro) {
          setAuthenticate(false);
          return;
        }
        setAuthenticate(user);
      } catch (error) {
        //
      }
    }
    fetchAuthenticatedUser();
  }, []);

  // Top 1 carro em destaque (exemplo)
  const topCar = carros[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-zinc-100 flex flex-col">
      <Header authenticate={authenticate} onSearch={setBusca} />
      <main className="flex-1 w-full max-w-7xl mx-auto pt-28 pb-10 px-2 sm:px-6">
        {/* Hero Section */}
        <section className="mb-10 flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 mb-4 leading-tight">
              Encontre o carro perfeito para você
            </h1>
            <p className="text-zinc-600 text-lg mb-6 max-w-xl mx-auto md:mx-0">
              Explore nossa seleção de carros de alta qualidade, com as melhores condições e preços do mercado.
            </p>
            <div className="flex justify-center md:justify-start">
              <input
                type="text"
                placeholder="Procurar carros por nome..."
                className="w-full max-w-xs px-4 py-3 border border-zinc-200 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white"
                value={busca}
                onChange={e => setBusca(e.target.value)}
                inputMode="search"
              />
            </div>
          </div>
          {/* Carro em destaque */}
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-xs md:max-w-sm">
              <CarCard car={topCar} />
            </div>
          </div>
        </section>

        {/* Listagem de carros */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-zinc-900 text-center sm:text-left">Todos os carros</h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10">
            {carrosFiltrados.length > 0 ? (
              carrosFiltrados.map((car) => <CarCard key={car.id} car={car} />)
            ) : (
              <p className="col-span-full text-center text-zinc-500">Nenhum carro encontrado.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
