import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";

export default function Header({ onSearch }: { onSearch: (value: string) => void }) {
  return (
    <header className="w-full fixed top-0 left-0 z-20 flex items-center justify-between py-3 px-2 sm:px-8 bg-white shadow-md">
      <div className="text-xl sm:text-2xl font-bold text-zinc-900 flex-shrink-0">CarStore</div>
      <div className="flex-1 flex justify-center mx-2">
        <input
          type="text"
          placeholder="Procurar carros..."
          className="w-full max-w-xs sm:max-w-md px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          onChange={e => onSearch(e.target.value)}
          inputMode="search"
        />
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <a
          href="/dashboard"
          className="px-3 py-1 rounded-full text-dark text-sm font-medium  xs:inline-block"
        >
          Dashboard
        </a>
        <Link href="/login" className="text-2xl sm:text-3xl text-zinc-700 cursor-pointer flex items-center">
          <FaUserCircle />
        </Link>
      </div>
    </header>
  );
}
