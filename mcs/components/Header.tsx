
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
import userPrivder from "@/utils/usersApi";

interface HeaderProps {
  onSearch?: (value: string) => void;
  theme?: 'light' | 'dark';
}

const Header: React.FC<HeaderProps> = ({ onSearch, theme = 'light' }) => {
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
  // O tema agora é controlado via prop
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

  const handleLogout = async () => {
    const message: any =await userPrivder.logoutUser();
    if(message.message){
      if (typeof window !== 'undefined') {
        window.location.assign('/');
      }
    }
  };

  const handleProfile = () => {
    // Implement profile navigation logic here
  };

  return (
    <header
      className={`w-full fixed top-0 left-0 z-30 flex items-center justify-between py-4 px-3 sm:px-10 shadow-lg animate-fadeIn ${theme === 'dark' ? 'bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-700' : 'bg-gradient-to-r from-zinc-100 via-white to-zinc-50'}`}
      style={{
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transition: 'background 0.4s cubic-bezier(.4,0,.2,1)',
      }}
    >
      {/* Logo animada */}
      <a href="/" className="flex items-center gap-2 group">
        <span className={`hidden sm:inline text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow animate-slideDown ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}> 
          CarStore
        </span>
        <span className={`inline sm:hidden text-lg font-extrabold tracking-tight drop-shadow animate-slideDown ${theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'}`}> 
          CS
        </span>
        <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full animate-pulse group-hover:scale-125 transition-transform ${theme === 'dark' ? 'bg-gradient-to-br from-yellow-400 to-pink-600' : 'bg-gradient-to-br from-yellow-400 to-pink-500'}`} />
      </a>

      <div className="flex items-center gap-2">
        <button
          className={`text-2xl cursor-pointer transition-colors duration-200 flex items-center animate-fadeIn focus:outline-none p-1 rounded-full ${theme === 'dark' ? 'text-zinc-100 hover:text-yellow-300' : 'text-zinc-700 hover:text-yellow-600'}`}
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
        {authenticate && (
          <button
            className={`px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-full font-semibold shadow transition-colors duration-200 backdrop-blur-md border ${theme === 'dark' ? 'bg-zinc-700/40 text-zinc-100 hover:bg-zinc-700/60 border-zinc-400/20' : 'bg-zinc-200/60 text-zinc-900 hover:bg-zinc-300/80 border-zinc-300/40'}`}
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
        <UserMenu
          open={!!menuOpen && !!authenticate}
          onClose={() => setMenuOpen(false)}
          onLogout={handleLogout}
          onProfile={handleProfile}
        />
      </div>
    </header>
  );
};

export default Header;
