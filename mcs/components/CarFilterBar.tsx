import React from "react";
import BrandFilterCard from "@/components/BrandFilterCard";

interface CarFilterBarProps {
  search: string;
  setSearch: (value: string) => void;
  brandFilter: string | null;
  setBrandFilter: (value: string | null) => void;
  popularBrands: string[];
  theme: "light" | "dark";
}

const CarFilterBar: React.FC<CarFilterBarProps> = ({
  search,
  setSearch,
  brandFilter,
  setBrandFilter,
  popularBrands,
  theme,
}) => {
  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Buscar por nome, marca ou ano..."
        className={`w-full max-w-md px-4 py-2 rounded-full border shadow focus:outline-none focus:ring-4 text-base transition-all mb-2 ${theme === "dark" ? "border-zinc-700 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white" : "border-blue-200 bg-white text-zinc-900 focus:ring-blue-100"}`}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {popularBrands.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {popularBrands.map((brand) => (
            <BrandFilterCard
              key={brand}
              brand={brand}
              selected={brandFilter === brand}
              onClick={(b) => setBrandFilter(brandFilter === b ? null : b)}
            />
          ))}
          {brandFilter && (
            <button
              className={`px-3 py-2 rounded-lg border text-xs font-semibold ml-2 ${theme === "dark" ? "border-zinc-700 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white" : "border-blue-200 bg-white text-blue-700"}`}
              onClick={() => setBrandFilter(null)}
              type="button"
            >
              Limpar filtro
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CarFilterBar;
