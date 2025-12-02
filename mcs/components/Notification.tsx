

type NotificationProps = {
  message: string;
  type: "success" | "error";
  onClose?: () => void;
};

import React, { useEffect } from "react";

export default function Notification({ message, type, onClose }: NotificationProps) {
  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg flex items-center gap-2
        ${type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}
        animate-slideDown`}
      role="alert"
      style={{
        animation: 'slideDown 0.5s cubic-bezier(.32,2,.55,.27)',
      }}
    >
      {type === "success" ? (
        <svg width="24" height="24" fill="none" className="mr-2">
          <circle cx="12" cy="12" r="12" fill="#22c55e" />
          <path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="24" height="24" fill="none" className="mr-2">
          <circle cx="12" cy="12" r="12" fill="#ef4444" />
          <path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      <span>{message}</span>
      {onClose && (
        <button
          className="ml-4 text-white font-bold"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>
      )}
    </div>
  );
}