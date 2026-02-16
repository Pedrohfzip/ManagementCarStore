import React from "react";
import BrandFilterCard from "@/components/BrandFilterCard";

interface HomeFilterModalProps {
  search: string;
  setSearch: (value: string) => void;
  brandFilter: string | null;
  setBrandFilter: (value: string | null) => void;
  popularBrands: string[];
  theme: "light" | "dark";
  onClose: () => void;
  cityFilter: string | null;
  setCityFilter: (value: string | null) => void;
  cityList: string[];
}

const HomeFilterModal: React.FC<HomeFilterModalProps> = ({
  search,
  setSearch,
  brandFilter,
  setBrandFilter,
  popularBrands,
  theme,
  onClose,
  cityFilter,
  setCityFilter,
  cityList,
}) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 sm:hidden">
      <aside className={`${theme === 'dark' ? 'bg-zinc-800 text-zinc-100' : 'bg-zinc-50 text-zinc-900'} rounded-xl shadow-2xl p-6 w-[90vw] max-w-xs flex flex-col gap-6 relative animate-fadeIn`}>
        <div className="flex justify-between items-center mb-2">
          <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}>Buscar e Filtrar</h2>
          <button
            className={`text-2xl px-2 ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}`}
            onClick={onClose}
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
            value={search}
            onChange={e => setSearch(e.target.value)}
            inputMode="search"
          />
        </div>
        <div>
          <h3 className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}`}>Marcas</h3>
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
        </div>

        {/* Filtro de cidades */}
        <div>
          <h3 className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}`}>Cidade</h3>
          <select
            className={`${theme === 'dark' ? 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white border-zinc-700' : 'bg-gradient-to-br from-zinc-100 via-white to-zinc-50 text-zinc-900 border-zinc-200'} w-full px-4 py-3 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-500 text-base border mb-2`}
            value={cityFilter || ''}
            onChange={e => setCityFilter(e.target.value || null)}
          >
            <option value="">Todas as cidades</option>
            {cityList.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          {cityFilter && (
            <button
              className={`px-3 py-2 rounded-lg border text-xs font-semibold ml-2 ${theme === 'dark' ? 'border-blue-900 bg-zinc-900 text-blue-200' : 'border-blue-200 bg-white text-blue-700'}`}
              onClick={() => setCityFilter(null)}
              type="button"
            >
              Limpar filtro
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};

export default HomeFilterModal;
