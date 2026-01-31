import { useEffect, useRef } from "react";

interface UserMenuProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  onProfile: () => void;
}

export default function UserMenu({ open, onClose, onLogout, onProfile }: UserMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div ref={menuRef} className="absolute right-0 top-14 bg-white rounded-xl shadow-xl border border-blue-100 py-2 w-44 z-[1000] animate-fadeIn">
      <button
        className="w-full text-left px-5 py-3 hover:bg-blue-50 text-blue-700 font-semibold rounded-t-xl transition-colors"
        onClick={onProfile}
      >
        Perfil
      </button>
      <button
        className="w-full cursor-pointer text-left px-5 py-3 hover:bg-blue-50 text-red-600 font-semibold rounded-b-xl transition-colors"
        onClick={onLogout}
      >
        Sair
      </button>
    </div>
  );
}
