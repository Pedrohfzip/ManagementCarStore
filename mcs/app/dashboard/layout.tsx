'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import './dashboard.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout flex">
      {/* Botão de menu para mobile */}
      <button
        className="fixed top-4 left-4 z-30 bg-blue-600 text-white rounded-full p-2 flex items-center justify-center text-2xl shadow-lg md:hidden"
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label="Abrir/fechar menu"
      >
        <FaBars />
      </button>
      {/* Sidebar */}
      <aside
        className={`sidebar flex flex-col items-center py-6 bg-white z-20 transition-transform duration-300 fixed md:static h-full md:h-auto top-0 left-0 w-64 md:w-60 shadow-lg md:shadow-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="mb-8 flex flex-col items-center w-full">
          <button className="bg-blue-600 text-white rounded-full p-3 flex items-center justify-center text-4xl hover:bg-blue-700 transition">
            <FaUserCircle />
          </button>
        </div>
        <nav className="w-full flex-1 flex flex-col items-center">
          <ul className="flex flex-col gap-4 w-full items-center">
            <li className="w-full flex justify-center"><Link href="/" className="sidebar-link" onClick={() => setSidebarOpen(false)}>← Back to Store</Link></li>
            <li className="w-full flex justify-center"><Link href="/dashboard" className="sidebar-link" onClick={() => setSidebarOpen(false)}>Início</Link></li>
            <li className="w-full flex justify-center"><Link href="/dashboard/usuarios" className="sidebar-link" onClick={() => setSidebarOpen(false)}>Usuários</Link></li>
            <li className="w-full flex justify-center"><Link href="/dashboard/cars" className="sidebar-link" onClick={() => setSidebarOpen(false)}>Cars</Link></li>
            {/* Adicione mais links conforme necessário */}
          </ul>
        </nav>
      </aside>
      {/* Conteúdo principal */}
      <main className="dashboard-content flex-1">
        {children}
      </main>
    </div>
  );
}
