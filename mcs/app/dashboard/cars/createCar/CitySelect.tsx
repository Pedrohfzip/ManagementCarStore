
import React, { useEffect, useState } from "react";
import cityProvider from '@/utils/city';

interface City {
  id: string;
  city: string;
  state?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CitySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const CitySelect: React.FC<CitySelectProps> = ({ value, onChange }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showList, setShowList] = useState(false);

    // Fecha a lista ao clicar fora
  useEffect(() => {
    if (!showList) return;
    const handleClick = (e: MouseEvent) => {
      const input = document.getElementById('city-search');
      const list = document.getElementById('city-list');
      if (input && !input.contains(e.target as Node) && list && !list.contains(e.target as Node)) {
        setShowList(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showList]);
  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await cityProvider.getCities();
        setCities(Array.isArray(result) ? result : []);
      } catch (err: any) {
        setError("Erro ao buscar cidades");
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  // Filtra cidades pelo texto
  const filteredCities = cities.filter(c => c.city.toLowerCase().includes(search.toLowerCase()));
  // Busca nome da cidade pelo id selecionado
  const selectedCityName = cities.find(c => c.id === value)?.city || "";

  return (
    <div className="space-y-2 relative bg-black/20 ">
      <label htmlFor="city-search" className="flex items-center gap-2 text-white font-medium">
        Cidade
      </label>
      <input
        id="city-search"
        type="text"
        value={search || selectedCityName}
        onChange={e => {
          setSearch(e.target.value);
          setShowList(true);
        }}
        onFocus={() => setShowList(true)}
        className="bg-blue-50/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg px-4 py-2 w-full"
        placeholder="Digite para pesquisar"
        autoComplete="off"
        required
        disabled={loading || cities.length === 0}
      />
      {showList && filteredCities.length > 0 && (
        <ul id="city-list" className="absolute z-10 bg-black/80 border border-blue-200 rounded-lg mt-1 w-full max-h-48 overflow-y-auto shadow-lg">
          {filteredCities.map(cityObj => (
            <li
              key={cityObj.id}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${value === cityObj.id ? 'bg-blue-50' : ''}`}
              onMouseDown={() => {
                onChange(cityObj.id);
                setSearch(cityObj.city);
                setShowList(false);
              }}
            >
              {cityObj.city} <span className="text-xs text-zinc-400">{cityObj.state}</span>
            </li>
          ))}
        </ul>
      )}
      {loading && <span className="text-xs text-zinc-400">Carregando cidades...</span>}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default CitySelect;
