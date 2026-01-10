
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
        console.log("Usuário autenticado:", user);
        if(user.erro){
          setAuthenticate(false);
          return;
        }
        setAuthenticate(user);
      } catch (error) {
        console.error("Erro ao buscar usuário autenticado:", error);
      }
    }
    fetchAuthenticatedUser();
  }, []);
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header authenticate={authenticate} onSearch={setBusca} />
      <main className="flex-1 w-full max-w-6xl mx-auto pt-24 pb-6 px-2 sm:px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-zinc-900 text-center sm:text-left">Carros à venda</h1>
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
          {carrosFiltrados.length > 0 ? (
            carrosFiltrados.map((car) => <CarCard key={car.id} car={car} />)
          ) : (
            <p className="col-span-full text-center text-zinc-500">Nenhum carro encontrado.</p>
          )}
        </div>
      </main>
    </div>
  );
}
