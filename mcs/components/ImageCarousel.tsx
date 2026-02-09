import { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  theme: 'light' | 'dark';
}

const carouselImages = [
  {
    url: 'https://images.unsplash.com/photo-1647340764627-11713b9d0f65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzcG9ydHMlMjBjYXIlMjBzaG93cm9vbXxlbnwxfHx8fDE3NzAxNTUwODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Carros Esportivos de Luxo',
    subtitle: 'Experiência de direção incomparável'
  },
  {
    url: 'https://images.unsplash.com/photo-1581182394120-34b20c0c60ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBlbGVjdHJpYyUyMGNhcnxlbnwxfHx8fDE3NzAxNjM5Njh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Carros Elétricos Modernos',
    subtitle: 'O futuro da mobilidade está aqui'
  },
  {
    url: 'https://images.unsplash.com/photo-1709559593427-4b7ac31080d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXBlcmNhciUyMHJhY2luZyUyMHRyYWNrfGVufDF8fHx8MTc3MDE2Mzk2OHww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Performance Extrema',
    subtitle: 'Supercarros para os mais exigentes'
  },
  {
    url: 'https://images.unsplash.com/photo-1760346517263-afcb7bd2e7d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwdmludGFnZSUyMGF1dG9tb2JpbGV8ZW58MXx8fHwxNzcwMTYzOTcwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Clássicos Vintage',
    subtitle: 'Elegância atemporal'
  },
  {
    url: 'https://images.unsplash.com/photo-1673298448498-2306bb01b65c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwZGVhbGVyc2hpcHxlbnwxfHx8fDE3NzAxNjM5Njl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Sua Próxima Jornada',
    subtitle: 'Encontre o carro dos seus sonhos'
  }
];

function NextArrow(props: any) {
  const { onClick, theme } = props;
  return (
    <button
      onClick={onClick}
      className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20 backdrop-blur-md text-white' : 'bg-black/10 hover:bg-black/20 backdrop-blur-md text-white'} shadow-lg`}
      aria-label="Próximo slide"
    >
      <ChevronRight className="w-6 h-6" />
    </button>
  );
}

function PrevArrow(props: any) {
  const { onClick, theme } = props;
  return (
    <button
      onClick={onClick}
      className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20 backdrop-blur-md text-white' : 'bg-black/10 hover:bg-black/20 backdrop-blur-md text-white'} shadow-lg`}
      aria-label="Slide anterior"
    >
      <ChevronLeft className="w-6 h-6" />
    </button>
  );
}

export function ImageCarousel({ theme }: ImageCarouselProps) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
    nextArrow: <NextArrow theme={theme} />,
    prevArrow: <PrevArrow theme={theme} />,
    appendDots: (dots: any) => (
      <div className="absolute bottom-6">
        <ul className="flex gap-2">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <button className="w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-all duration-300" />
    )
  };

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] overflow-hidden rounded-2xl shadow-2xl mx-auto">
      <Slider {...settings}>
        {carouselImages.map((image, index) => (
          <div key={index} className="relative h-[400px] sm:h-[500px]">
            <div className="absolute inset-0">
              <img 
                src={image.url} 
                alt={image.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {/* Degradê extra na parte inferior */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 via-black/0 to-transparent pointer-events-none" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                {image.title}
              </h2>
              <p className="text-lg sm:text-xl text-white/90 drop-shadow-md">
                {image.subtitle}
              </p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
