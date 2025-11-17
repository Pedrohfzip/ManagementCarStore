import React from 'react';
import Link from 'next/link';
import './dashboard.css'; // Opcional: crie um CSS para estilizar

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <nav>
          <ul>
            <li><Link href="/dashboard">Início</Link></li>
            <li><Link href="/dashboard/usuarios">Usuários</Link></li>
            <li><Link href="/dashboard/configuracoes">Configurações</Link></li>
            {/* Adicione mais links conforme necessário */}
          </ul>
        </nav>
      </aside>
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
}
