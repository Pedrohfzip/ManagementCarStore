
"use client";
import React, { useEffect, useState } from "react";
// Carrossel simples para imagens
import { Calendar, Droplet, Gauge, Palette, DollarSign, Phone } from "lucide-react";
import { useSearchParams } from "next/navigation";
import carsApi from "@/utils/carsApi";
import Header from "../../components/Header";
import { motion } from "framer-motion";
import CarImageGallery from "../../components/CarImageGallery";
import CarSpecs from "../../components/CarSpecs";
import CarHighlights from "../../components/CarHighlights";
export default function CarPage() {
  const [activeImage, setActiveImage] = useState(1);

  // Sempre que o carro mudar, reseta o índice da imagem ativa

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCar() {
      try {
        setLoading(true);
        if (!id) {
          setError("ID do carro não informado.");
          setLoading(false);
          return;
        }
        const data = await carsApi.getCarById(id);
        console.log(data);
        setCar(data);
      } catch (err) {
        setError("Erro ao buscar carro.");
      } finally {
        setLoading(false);
      }
    }
    fetchCar();
  }, [id]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-zinc-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-zinc-600">Carregando detalhes...</p>
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-zinc-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <p className="text-xl text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-zinc-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <p className="text-xl text-zinc-600">Carro não encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Hero header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-primary rounded-2xl px-6 sm:px-8 py-6 mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-primary-foreground mb-1">
              {car.name}
            </h1>
            <p className="text-primary-foreground/70 text-base">
              {car.brand} • {car.year}
            </p>
          </div>
          <div className="lg:text-right">
            <p className="text-primary-foreground/60 text-xs uppercase tracking-wider mb-0.5">
              Preço
            </p>
            <p className="text-3xl sm:text-4xl font-extrabold text-gradient-gold font-sans">
              R${" "}
              {Number(car.price).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CarImageGallery images={car.images} carName={car.name} />
          </motion.div>

          {/* Right: Specs + Description + Contact */}
          <div className="space-y-6">
            <CarSpecs car={car} />

            {/* Description */}
            {car.description && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <h2 className="text-2xl font-display font-bold text-foreground mb-3">
                  Descrição
                </h2>
                <div className="bg-muted/50 rounded-xl p-5 border border-border">
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {car.description}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Highlights */}
        <CarHighlights />
      </main>
    </>
  );
}
