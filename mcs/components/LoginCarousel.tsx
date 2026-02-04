import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const carouselImages = [
  {
    url: 'https://images.unsplash.com/photo-1647340764627-11713b9d0f65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzcG9ydHMlMjBjYXIlMjBzaG93cm9vbXxlbnwxfHx8fDE3NzAxNTUwODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Experiência Premium',
    subtitle: 'Descubra os melhores veículos do mercado'
  },
  {
    url: 'https://images.unsplash.com/photo-1760839722821-e55bd0df9785?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBjYXIlMjBibGFja3xlbnwxfHx8fDE3NzAxNjUzMDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Luxo e Sofisticação',
    subtitle: 'Carros que definem seu estilo de vida'
  },
  {
    url: 'https://images.unsplash.com/photo-1549041732-a8307955cfdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBkZWFsZXJzaGlwJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcwMTYzNDI5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Showroom Exclusivo',
    subtitle: 'Uma seleção incomparável de veículos'
  },
  {
    url: 'https://images.unsplash.com/photo-1564594387948-9ecf6ab4f873?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwc3BvcnRzJTIwY2FyJTIwcmVkfGVufDF8fHx8MTc3MDE2NTMwOHww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Performance e Elegância',
    subtitle: 'O carro dos seus sonhos está aqui'
  }
];

export function LoginCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleDotClick = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Images */}
      <div className="relative w-full h-full">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentIndex
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-indigo-900/80" />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 lg:p-16">
        <div className="max-w-xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg transition-all duration-700">
            {carouselImages[currentIndex].title}
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 drop-shadow-md transition-all duration-700">
            {carouselImages[currentIndex].subtitle}
          </p>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
          <button
            onClick={handlePrev}
            className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 pointer-events-auto group"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 pointer-events-auto group"
            aria-label="Próximo"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}