
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect } from "react";
import carsApi from "@/utils/carsApi";
import { useDispatch } from "react-redux";
import { setCars, setLoading, setError } from "../redux/slices/carsSlice";
import { useRouter } from "next/navigation";
import UserMenu from "./UserMenu";
import userProvider from "@/utils/usersApi";
import { Search, X } from "lucide-react";
import { data } from "autoprefixer";
interface HeaderProps {
  onSearch?: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [authenticate, setAuthenticate] = useState<any>(null);
    useEffect(() => {
      async function fetchAuth() {
        try {
          if (typeof window !== 'undefined' && window.localStorage.getItem('token')) {
            try {
              await userProvider.refreshToken();
            } catch (refreshErr) {}
          }
        } catch {}
        try {
          const user: any = await userProvider.getAuthenticatedUser();
          if (user.error) {
            setAuthenticate(false);
            return;
          }
          setAuthenticate(user);
        } catch (error) {
          setAuthenticate(false);
        }
      }
      fetchAuth();
    }, []);
  const [searchFocus, setSearchFocus] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const router = useRouter();
  const dispatch = useDispatch();

  const handleInternalSearch = async (query: any) => {
    dispatch(setLoading(true));
    try {
      let result;
      if (!query || query.trim() === "") {
        // Busca todos os carros se o input estiver vazio
        result = await carsApi.getAllCars();
      } else {
        result = await carsApi.searchCars({ data: query });
      }
      dispatch(setCars(result));
      dispatch(setError(null));
    } catch (err) {
      dispatch(setError('Erro ao buscar carros.'));
    } finally {
      dispatch(setLoading(false));
    }
    if (onSearch) onSearch(query);
  };

  const handleLogout = () => {
    // Implement logout logic here
  };

  const handleProfile = () => {
    // Implement profile navigation logic here
  };

  return (
    <header
      className="w-full fixed top-0 left-0 z-30 flex items-center justify-between py-4 px-3 sm:px-10 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 shadow-lg animate-fadeIn"
      style={{
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transition: 'background 0.4s cubic-bezier(.4,0,.2,1)',
      }}
    >
      {/* Logo animada */}
      <a href="/" className="flex items-center gap-2 group">
        <span className="hidden sm:inline text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow animate-slideDown">
          CarStore
        </span>
        <span className="inline sm:hidden text-lg font-extrabold text-white tracking-tight drop-shadow animate-slideDown">
          CS
        </span>
        <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full animate-pulse group-hover:scale-125 transition-transform" />
      </a>

      {/* Campo de busca desktop (>=640px) */}
      <div className="hidden sm:flex flex-1 justify-center mx-2">
        <input
          type="text"
          placeholder="Procurar carros..."
          className={`w-full max-w-xs sm:max-w-md px-4 py-2 rounded-full border-none shadow focus:outline-none focus:ring-4 focus:ring-blue-300 text-base transition-all duration-300 ${searchFocus ? 'bg-white ring-2 ring-blue-400 scale-105' : 'bg-blue-100/80'}`}
          onChange={e => handleInternalSearch(e.target.value)}
          onFocus={() => setSearchFocus(true)}
          onBlur={() => setSearchFocus(false)}
          inputMode="search"
        />
      </div>

      {/* Ícone de busca mobile (<640px) */}
      <div className="flex sm:hidden flex-1 justify-center">
        <div className="relative">
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-200 backdrop-blur-md border border-white/20"
            aria-label="Abrir busca"
          >
            {mobileSearchOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </button>
          {mobileSearchOpen && (
            <div className="absolute top-full mt-2 right-0   w-40 animate-fadeIn z-50">
              <input
                type="text"
                placeholder="Procurar carros..."
                className="w-full px-4 py-2 rounded-full border-none shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 text-base bg-white text-zinc-900"
                onChange={e => handleInternalSearch(e.target.value)}
                onFocus={() => setSearchFocus(true)}
                onBlur={() => setSearchFocus(false)}
                inputMode="search"
                autoFocus
              />
            </div>
          )}
        </div>
      </div>

      {authenticate && (
        <button
          className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-full bg-white/10 text-white font-semibold shadow hover:bg-white/20 transition-colors duration-200 backdrop-blur-md border border-white/20 mr-2"
          style={{ boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)' }}
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.assign('/dashboard');
            }
          }}
        >
          <span className="hidden sm:inline">Dashboard</span>
          <span className="sm:hidden">DB</span>
        </button>
      )}
      <button
        className="text-2xl text-white hover:text-yellow-300 transition-colors duration-200 flex items-center animate-fadeIn focus:outline-none p-1 rounded-full"
        style={{ minWidth: 36, minHeight: 36 }}
        onClick={() => {
          if (authenticate) {
            setMenuOpen(!menuOpen);
          } else {
            if (typeof window !== 'undefined') {
              window.location.assign('/login');
            }
          }
        }}
        aria-label={authenticate ? "Abrir menu do usuário" : "Ir para login"}
        type="button"
      >
        <FaUserCircle className="drop-shadow" />
      </button>

      <UserMenu
        open={!!menuOpen && !!authenticate}
        onClose={() => setMenuOpen(false)}
        onLogout={handleLogout}
        onProfile={handleProfile}
      />
    </header>
  );
};

export default Header;
