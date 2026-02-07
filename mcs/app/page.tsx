"use client";
import { useState, useEffect, useMemo } from "react";
import Header from "../components/Header";
import CarCard from "../components/CarCard";
import BrandFilterCard from "../components/BrandFilterCard";
import HomeFilterModal from "../components/HomeFilterModal";
import usersApi from "@/utils/usersApi";
import { useSelector, useDispatch } from "react-redux";
import { setCars, setLoading, setError } from "../redux/slices/carsSlice";
import carsApi from "@/utils/carsApi";
import { ImageCarousel } from "@/components/ImageCarousel";
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
    async function tryRefreshToken() {
      if (typeof window !== 'undefined' && window.localStorage.getItem('token')) {
        try {
          await usersApi.refreshToken();
        } catch (err) {
          window.location.assign('/login');
        }
      }
    }
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
    tryRefreshToken().then(fetchFilteredCars);
  }, [busca, brandFilter, dispatch]);

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

    const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Adicionar classe ao body para tema escuro
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
  }, []);
console.log('Carros para exibir:', cars);
  // Top 1 carro em destaque (primeiro do array)

    // Evita renderizar até o tema ser definido no client
    if (theme === null) return null;
    return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-zinc-100 text-zinc-900'}`}>
      <Header onSearch={setBusca} theme={theme} />
      
      {/* Botão de tema flutuante colado à direita */}

      <div className="   mx-auto w-full">
        <ImageCarousel theme={theme} />
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
          <HomeFilterModal
            search={busca}
            setSearch={setBusca}
            brandFilter={brandFilter}
            setBrandFilter={setBrandFilter}
            popularBrands={popularBrands}
            theme={theme}
            onClose={() => setFiltroAberto(false)}
          />
        )}
        {/* Filtro lateral fixo no desktop */}
                <aside className={`sticky top-28 h-[calc(100vh-9rem)] min-w-[280px] max-w-xs rounded-2xl p-6 mr-8 flex-col gap-6 z-20 hidden sm:flex transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-800/80 backdrop-blur-sm border border-zinc-700' : 'bg-white/80 backdrop-blur-sm border border-zinc-200 shadow-xl'}`}>
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>
            Buscar e Filtrar
          </h2>
          
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}`}>
              Nome do carro
            </h3>
            <input
              type="text"
              placeholder="Procurar carros..."
              className={`w-full px-4 py-3 rounded-xl border transition-all ${
                theme === 'dark'
                  ? 'bg-zinc-900 text-white border-zinc-700 placeholder:text-zinc-500'
                  : 'bg-white text-zinc-900 border-zinc-300 placeholder:text-zinc-400'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={busca}
              onChange={e => setBusca(e.target.value)}
              inputMode="search"
            />
          </div>

          <div>
            <h3 className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}`}>
              Marcas
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {popularBrands.map((brand) => (
                <BrandFilterCard
                  key={brand}
                  brand={brand}
                  selected={brandFilter === brand}
                  onClick={(b) => setBrandFilter(brandFilter === b ? null : b)}
                />
              ))}
            </div>
            {brandFilter && (
              <button
                className="w-full py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors text-sm"
                onClick={() => setBrandFilter(null)}
                type="button"
              >
                Limpar filtro
              </button>
            )}
          </div>
        </aside>
        {/* <aside className={`sticky top-28 h-[calc(100vh-7rem)] min-w-[260px] max-w-xs rounded-xl  p-4 mr-8 flex-col gap-6 z-20 hidden sm:flex ${theme === 'dark' ? 'bg-zinc-800 text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
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
        </aside> */}
        {/* Catálogo de carros rolável */}
        <section className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 9rem)' }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Catálogo de Carros
              {brandFilter && (
                <span className="text-blue-600 dark:text-blue-400"> - {brandFilter}</span>
              )}
            </h2>
            <div className={`px-4 py-2 rounded-full ${theme === 'dark' ? 'bg-zinc-800' : 'bg-white'} shadow-md`}>
              <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600'}`}>
                {cars.length} {cars.length === 1 ? 'carro' : 'carros'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
            {cars.length > 0 ? (
              cars.map((car) => <CarCard key={car.id} car={car} />)
            ) : (
              <div className="col-span-full text-center py-16">
                <div className={`text-6xl mb-4 ${theme === 'dark' ? 'text-zinc-700' : 'text-zinc-300'}`}>
                  🚗
                </div>
                <p className={`text-xl font-semibold ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Nenhum carro encontrado
                </p>
                <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'}`}>
                  Tente ajustar os filtros
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
