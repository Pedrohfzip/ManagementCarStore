"use client";
import React, { useEffect, useState } from "react";
// Carrossel simples para imagens
import { Calendar, Droplet, Gauge, Palette, DollarSign, Phone } from "lucide-react";
import { useSearchParams } from "next/navigation";
import carsApi from "@/utils/carsApi";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-zinc-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header com título e preço */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">
                  {car.name}
                </h1>
                <p className="text-xl text-blue-100">
                  {car.brand} • {car.year}
                </p>
              </div>
              <div className="text-left lg:text-right">
                <p className="text-blue-100 text-sm mb-1">Preço</p>
                <p className="text-4xl sm:text-5xl font-extrabold text-white">
                  R$ {Number(car.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Coluna da esquerda - Carrossel de imagens */}
              <div className="space-y-6">
                <div className="relative group">
                  {car.images.length > 0 && (
                    <img
                      src={car.images[activeImage]?.imageUrl || car.images[0].imageUrl}
                      alt={car.name}
                      className="rounded-2xl shadow-2xl w-full h-[400px] object-cover bg-zinc-100 transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  )}
                  {/* Botões de navegação do carrossel */}
                  {car.images.length > 1 && (
                    <>
                      <button
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow z-10"
                        onClick={() => setActiveImage((prev) => {
                          console.log(prev);
                          const total = car.images.length;
                          return prev === 0 ? total - 1 : prev - 1;
                        })}
                        aria-label="Imagem anterior"
                        type="button"
                      >
                        &#8592;
                      </button>
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow z-10"
                        onClick={() => setActiveImage((prev) => {
                          const total = car.images.length;
                          return prev === total - 1 ? 0 : prev + 1;
                        })}
                        aria-label="Próxima imagem"
                        type="button"
                      >
                        &#8594;
                      </button>
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Galeria de miniaturas baseada em car.images */}
                <div className="grid grid-cols-4 gap-3">
                  {car.images.length > 0 ? (
                    car.images.map((img, idx) => (
                      <div
                        key={img.id || idx}
                        className={`aspect-video bg-zinc-200 rounded-lg overflow-hidden hover:ring-2 ring-blue-500 transition cursor-pointer ${activeImage === idx ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={() => setActiveImage(idx)}
                      >
                        <img
                          src={img.imageUrl}
                          alt={`Foto ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="aspect-video bg-zinc-200 rounded-lg overflow-hidden">
                      <img
                        src={car.photo || "/car-placeholder.png"}
                        alt="Foto única"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Coluna da direita - Informações */}
              <div className="space-y-8">
                {/* Especificações principais em cards */}
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900 mb-4">Especificações</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Ano */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 hover:shadow-lg transition">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-semibold text-zinc-600">Ano</span>
                      </div>
                      <p className="text-2xl font-bold text-zinc-900">{car.year}</p>
                    </div>

                    {/* Combustível */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200 hover:shadow-lg transition">
                      <div className="flex items-center gap-3 mb-2">
                        <Droplet className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-semibold text-zinc-600">Combustível</span>
                      </div>
                      <p className="text-2xl font-bold text-zinc-900">{car.gas}</p>
                    </div>

                    {/* Quilometragem */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200 hover:shadow-lg transition">
                      <div className="flex items-center gap-3 mb-2">
                        <Gauge className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-semibold text-zinc-600">Quilometragem</span>
                      </div>
                      <p className="text-2xl font-bold text-zinc-900">{car.km} km</p>
                    </div>

                    {/* Cor */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200 hover:shadow-lg transition">
                      <div className="flex items-center gap-3 mb-2">
                        <Palette className="w-5 h-5 text-orange-600" />
                        <span className="text-sm font-semibold text-zinc-600">Cor</span>
                      </div>
                      <p className="text-2xl font-bold text-zinc-900">{car.color}</p>
                    </div>
                  </div>
                </div>

                {/* Descrição */}
                {car.description && (
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-900 mb-4">Descrição</h2>
                    <div className="bg-zinc-50 rounded-xl p-6 border border-zinc-200">
                      <p className="text-zinc-700 leading-relaxed">
                        {car.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Botão de contato - destaque */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-1 shadow-xl">
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Phone className="w-6 h-6 text-green-600" />
                      <h3 className="text-xl font-bold text-zinc-900">Entre em contato</h3>
                    </div>
                    <p className="text-zinc-600 mb-4">
                      Interessado neste veículo? Fale diretamente com o vendedor pelo WhatsApp!
                    </p>
                    <a
                      href={`https://wa.me/${car.sellerPhone || "5599999999999"}?text=Olá! Tenho interesse no carro ${car.name}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Falar com vendedor
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Aceita Financiamento</h3>
            <p className="text-zinc-600 text-sm">Parcele em até 60x</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2">Garantia</h3>
            <p className="text-zinc-600 text-sm">Veículo revisado</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2">Aceita Troca</h3>
            <p className="text-zinc-600 text-sm">Avaliamos seu usado</p>
          </div>
        </div>
      </div>
    </div>
  );
}
