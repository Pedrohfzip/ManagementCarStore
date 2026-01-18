"use client";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import CarCard from "../components/CarCard";
import usersApi from "@/utils/usersApi";
import { useSelector, useDispatch } from "react-redux";
import { setCars, setLoading, setError } from "../carsSlice";

export default function Page() {
  const [busca, setBusca] = useState("");
  const cars = useSelector((state: any) => state.cars.list);
  const loading = useSelector((state: any) => state.cars.loading);
  const error = useSelector((state: any) => state.cars.error);
  const dispatch = useDispatch();
  const [theme, setTheme] = useState<'light' | 'dark'>(typeof window !== 'undefined' && window.localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      window.localStorage.setItem('theme', theme);
    }
  }, [theme]);
  useEffect(() => {
    async function refreshAndFetch() {
      try {
        // Tenta renovar o token antes de buscar dados
        if (typeof window !== 'undefined' && window.localStorage.getItem('token')) {
          try {
            await usersApi.refreshToken();
          } catch (refreshErr) {}
        }
      } catch {}
      // Busca carros via Redux
      dispatch(setLoading(true));
      try {
        const carsApiModule = await import("@/utils/carsApi");
        const response: any = await carsApiModule.default.getAllCars();
        dispatch(setCars(response));
        dispatch(setError(null));
      } catch (err) {
        dispatch(setError('Erro ao buscar carros.'));
      } finally {
        dispatch(setLoading(false));
      }
    }
    refreshAndFetch();
  }, [dispatch]);

  // Top 1 carro em destaque (primeiro do array)

    return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-zinc-100 text-zinc-900'}`}>
      <Header onSearch={setBusca} />
      
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
        {/* Hero Section */}
        <section className="mb-10 flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 leading-tight">
              Encontre o carro perfeito para você
            </h1>
            <p className="text-lg mb-6 max-w-xl mx-auto md:mx-0">
              Explore nossa seleção de carros de alta qualidade, com as melhores condições e preços do mercado.
            </p>
            <div className="flex justify-center md:justify-start">
              <input
                type="text"
                placeholder="Procurar carros por nome..."
                className="w-full max-w-xs px-4 py-3 dark:border-zinc-700 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-zinc-50"
                value={busca}
                onChange={e => setBusca(e.target.value)}
                inputMode="search"
              />
            </div>
          </div>
        </section>

        {/* Listagem de carros */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center sm:text-left">Todos os carros</h2>
          {loading ? (
            <p>Carregando carros...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10">
              {cars && cars.length > 0 ? (
                cars.map((car: any) => <CarCard key={car.id} car={car} />)
              ) : (
                <p className="col-span-full text-center">Nenhum carro encontrado.</p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
