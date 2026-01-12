
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import UserMenu from "./UserMenu";
import userProvider from "@/utils/usersApi";
interface HeaderProps {
  authenticate: boolean;
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ authenticate, onSearch }) => {
  const [searchFocus, setSearchFocus] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleProfile = () => {
    setMenuOpen(false);
    router.push("/dashboard");
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    await userProvider.logoutUser();
    router.push("/login");
  };

  const handleUserIconClick = () => {
    if (authenticate) {
      setMenuOpen((open) => !open);
    } else {
      router.push("/login");
    }
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
      <Link href="/" className="flex items-center gap-2 group">
        <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow animate-slideDown">
          CarStore
        </span>
        <span className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full animate-pulse ml-1 group-hover:scale-125 transition-transform" />
      </Link>

      {/* Campo de busca animado */}
      <div className="flex-1 flex justify-center mx-2">
        <input
          type="text"
          placeholder="Procurar carros..."
          className={`w-full max-w-xs sm:max-w-md px-4 py-2 rounded-full border-none shadow focus:outline-none focus:ring-4 focus:ring-blue-300 text-base transition-all duration-300 ${searchFocus ? 'bg-white ring-2 ring-blue-400 scale-105' : 'bg-blue-100/80'}`}
          onChange={e => onSearch(e.target.value)}
          onFocus={() => setSearchFocus(true)}
          onBlur={() => setSearchFocus(false)}
          inputMode="search"
        />
      </div>

      {/* Ações do usuário */}
      <div className="flex items-center gap-3 flex-shrink-0 relative">
        {authenticate && (
          <button
            className="px-4 py-2 rounded-full bg-white/10 text-white font-semibold shadow hover:bg-white/20 transition-colors duration-200 backdrop-blur-md border border-white/20"
            style={{ boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)' }}
            onClick={() => router.push("/dashboard")}
          >
            Dashboard
          </button>
        )}
        <button
          className="text-3xl text-white hover:text-yellow-300 transition-colors duration-200 flex items-center animate-fadeIn focus:outline-none"
          onClick={handleUserIconClick}
          aria-label={authenticate ? "Abrir menu do usuário" : "Ir para login"}
        >
          <FaUserCircle className="drop-shadow" />
        </button>
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
