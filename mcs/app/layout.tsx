import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CarStore",
  description: "Gestão de carros premium e usuários - CarStore",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <title>CarStore</title>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="description" content="Gestão de carros premium e usuários - CarStore" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Logo e nome do site fixos no topo para todas as páginas */}
        <header className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 shadow text-white">
          <img src="/favicon.ico" alt="CarStore Logo" className="w-8 h-8" />
          <span className="text-2xl font-extrabold tracking-tight drop-shadow">CarStore</span>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
