import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CarImage } from "@/data/mockCar";

interface CarImageGalleryProps {
  images: CarImage[];
  carName: string;
}

const CarImageGallery = ({ images, carName }: CarImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = (index: number) => setActiveIndex(index);
  const goPrev = () =>
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goNext = () =>
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[16/10] group">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={images[activeIndex]?.imageUrl}
            alt={`${carName} - foto ${activeIndex + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm hover:bg-card rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="w-5 h-5 text-card-foreground" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm hover:bg-card rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="w-5 h-5 text-card-foreground" />
            </button>
          </>
        )}

        {/* Image counter */}
        <div className="absolute bottom-3 right-3 bg-foreground/60 backdrop-blur-sm text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((img, idx) => (
          <button
            key={img.id}
            onClick={() => goTo(idx)}
            className={`aspect-video rounded-lg overflow-hidden transition-all duration-200 ${
              activeIndex === idx
                ? "ring-2 ring-accent ring-offset-2 ring-offset-background scale-[0.97]"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <img
              src={img.imageUrl}
              alt={`Miniatura ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default CarImageGallery;
