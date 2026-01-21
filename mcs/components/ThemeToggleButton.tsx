import React, { useEffect, useState } from "react";

export default function ThemeToggleButton() {
  const [theme, setTheme] = useState<'light' | 'dark'>(typeof window !== 'undefined' && window.localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      window.localStorage.setItem('theme', theme);
    }
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex items-center gap-2 px-3 py-2 rounded-full shadow-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-600 transition hover:scale-100 text-lg"
      aria-label="Alternar modo claro/escuro"
      type="button"
    >
      {theme === 'dark' ? (
        <span className="text-yellow-400 text-xl" role="img" aria-label="Modo escuro">🌙</span>
      ) : (
        <span className="text-yellow-400 text-xl" role="img" aria-label="Modo claro">☀️</span>
      )}
    </button>
  );
}
