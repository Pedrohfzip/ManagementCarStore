"use client";
import { useState, useEffect, useMemo } from "react";
import Header from "../components/Header";
import CarCard from "../components/CarCard";
import BrandFilterCard from "../components/BrandFilterCard";
import usersApi from "@/utils/usersApi";
import { useSelector, useDispatch } from "react-redux";
import { setCars, setLoading, setError } from "../redux/slices/carsSlice";
import carsApi from "@/utils/carsApi";
export default function Page() {
  const [busca, setBusca] = useState("");
  const cars = useSelector((state: any) => state.cars.list);
  const loading = useSelector((state: any) => state.cars.loading);
  const error = useSelector((state: any) => state.cars.error);
  const dispatch = useDispatch();
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);
  const [brandFilter, setBrandFilter] = useState<string | null>(null);
  const [filtroAberto, setFiltroAberto] = useState(false);

  // Marcas populares dos carros carregados
  const popularBrands = useMemo(() => {
    const brandCount: Record<string, number> = {};
    const carList = Array.isArray(cars) ? cars : [];
    carList.forEach((car: any) => {
      const brand = (car.brand || car.marca || "").trim();
      if (brand) brandCount[brand] = (brandCount[brand] || 0) + 1;
    });
    return Object.entries(brandCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([brand]) => brand);
  }, [cars]);


  // Busca carros do backend usando searchCars, combinando busca e marca
  useEffect(() => {
    const fetchFilteredCars = async () => {
      dispatch(setLoading(true));
      try {
        // Monta os filtros para a query
        let params: any = {};
        if (busca && !isNaN(Number(busca)) && busca.length === 4) {
          params.year = busca;
        } else if (busca) {
          params.name = busca;
        }
        if (brandFilter) params.brand = brandFilter;
        if (!busca && !brandFilter) {
          const all = await carsApi.getAllCars();
          dispatch(setCars(all));
          dispatch(setError(null));
        } else {
          const result = await carsApi.searchCars(params);
          dispatch(setCars(result));
          dispatch(setError(null));
        }
      } catch (err) {
        dispatch(setError('Erro ao buscar carros.'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchFilteredCars();
  }, [busca, brandFilter]);

  // Define o tema após o mount para evitar hydration mismatch
  useEffect(() => {
    if (theme === null && typeof window !== 'undefined') {
      const storedTheme = window.localStorage.getItem('theme');
      setTheme(storedTheme === 'dark' ? 'dark' : 'light');
    }
  }, [theme]);

  useEffect(() => {
    if (theme && typeof window !== 'undefined') {
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
        console.log('Carros carregados:', response);
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

  useEffect(() => {
    console.log(cars);
  }, []);

  // Top 1 carro em destaque (primeiro do array)

    // Evita renderizar até o tema ser definido no client
    if (theme === null) return null;
    return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-zinc-100 text-zinc-900'}`}>
      <Header onSearch={setBusca} theme={theme} />
      
      {/* Botão de tema flutuante colado à direita */}
      <div className="fixed top-20 right-2 z-50">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex items-center gap-2 px-3 py-2 rounded-full shadow-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-600 transition hover:scale-100 text-lg"
          aria-label="Alternar modo claro/escuro"
        >
          {theme === 'dark' ? (
            <>
              <p>Dark</p>
            </>
          ) : (
            <>
              <p>Light</p>
            </>
          )}
        </button>
      </div>

      <main className={`flex-1 w-full  mx-auto pt-28 pb-10 px-2 sm:px-6 flex ${filtroAberto ? '' : 'justify-center'}`}>
        {/* Botão para abrir filtro no mobile */}
        <button
          className="sm:hidden fixed left-2 top-24 z-30 flex items-center gap-2 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white px-5 py-3 rounded-full shadow-2xl border-2 border-blue-300 font-bold text-base tracking-wide hover:scale-105 hover:from-blue-700 hover:to-blue-500 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
          onClick={() => setFiltroAberto(true)}
          aria-label="Abrir filtros"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
          Buscar / Filtros
        </button>
        {/* Filtro flutuante como modal no mobile */}
        {filtroAberto && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 sm:hidden">
            <aside className={`${theme === 'dark' ? 'bg-zinc-800 text-zinc-100' : 'bg-zinc-50 text-zinc-900'} rounded-xl shadow-2xl p-6 w-[90vw] max-w-xs flex flex-col gap-6 relative animate-fadeIn`}>
              <div className="flex justify-between items-center mb-2">
                <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>Buscar e Filtrar</h2>
                <button
                  className={`text-2xl px-2 ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}`}
                  onClick={() => setFiltroAberto(false)}
                  aria-label="Fechar filtros"
                >
                  ×
                </button>
              </div>
              <div className="mb-4">
                <h3 className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}`}>Nome do carro</h3>
                <input
                  type="text"
                  placeholder="Procurar carros por nome..."
                  className={`${theme === 'dark' ? 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white border-zinc-700' : 'bg-gradient-to-br from-zinc-100 via-white to-zinc-50 text-zinc-900 border-zinc-200'} w-full px-4 py-3 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-500 text-base border`}
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                  inputMode="search"
                />
              </div>
              <div>
                <h3 className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}`}>Marcas</h3>
                {cars !== null && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {popularBrands?.map((brand) => (
                      <BrandFilterCard
                        key={brand}
                        brand={brand}
                        selected={brandFilter === brand}
                        onClick={(b) => setBrandFilter(brandFilter === b ? null : b)}
                      />
                    ))}
                    {brandFilter && (
                      <button
                        className={`px-3 py-2 rounded-lg border text-xs font-semibold ml-2 ${theme === 'dark' ? 'border-blue-900 bg-zinc-900 text-blue-200' : 'border-blue-200 bg-white text-blue-700'}`}
                        onClick={() => setBrandFilter(null)}
                        type="button"
                      >
                        Limpar filtro
                      </button>
                    )}
                  </div>
                )}
              </div>
            </aside>
          </div>
        )}
        {/* Filtro lateral fixo no desktop */}
        <aside className={`sticky top-28 h-[calc(100vh-7rem)] min-w-[260px] max-w-xs rounded-xl  p-4 mr-8 flex-col gap-6 z-20 hidden sm:flex ${theme === 'dark' ? 'bg-zinc-800 text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
          <h2 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>Buscar e Filtrar</h2>
          <div className="mb-4">
            <h3 className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}`}>Nome do carro</h3>
            <input
              type="text"
              placeholder="Procurar carros por nome..."
              className={`${theme === 'dark' ? 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white border-zinc-700' : 'bg-gradient-to-br from-zinc-100 via-white to-zinc-50 text-zinc-900 border-zinc-200'} w-full px-4 py-3 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-500 text-base border`}
              value={busca}
              onChange={e => setBusca(e.target.value)}
              inputMode="search"
            />
          </div>
          <div>
            <h3 className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}`}>Marcas</h3>
            {cars !== null && (
              <div className="flex flex-wrap gap-2 mb-2">
                {popularBrands?.map((brand) => (
                  <BrandFilterCard
                    key={brand}
                    brand={brand}
                    selected={brandFilter === brand}
                    onClick={(b) => setBrandFilter(brandFilter === b ? null : b)}
                  />
                ))}
                {brandFilter && (
                  <button
                    className={`px-3 py-2 rounded-lg border text-xs font-semibold ml-2 ${theme === 'dark' ? 'border-blue-900 bg-zinc-900 text-blue-200' : 'border-blue-200 bg-white text-blue-700'}`}
                    onClick={() => setBrandFilter(null)}
                    type="button"
                  >
                    Limpar filtro
                  </button>
                )}
              </div>
            )}
          </div>
        </aside>
        {/* Catálogo de carros rolável */}
        <section className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 7rem)' }}>
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
