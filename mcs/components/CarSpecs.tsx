import { motion } from "framer-motion";
import { Calendar, Droplet, Gauge, Palette } from "lucide-react";
import type { Car } from "@/data/mockCar";
import CarHighlights from "./CarHighlights";

interface CarSpecsProps {
  car: Car;
}

const specs = [
  { key: "year" as const, label: "Ano", icon: Calendar, colorClass: "text-white bg-spec-blue/10 border-spec-blue/20" },
  { key: "gas" as const, label: "Combustível", icon: Droplet, colorClass: "text-white bg-spec-green/10 border-spec-green/20" },
  { key: "km" as const, label: "Quilometragem", icon: Gauge, colorClass: "text-white bg-spec-amber/10 border-spec-amber/20" },
  { key: "color" as const, label: "Cor", icon: Palette, colorClass: "text-white bg-spec-rose/10 border-spec-rose/20" },
];

const CarSpecs = ({ car }: CarSpecsProps) => {
  console.log(car);
  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-white mb-4">
        Especificações
      </h2>
      <div className="text-white grid grid-cols-2 gap-3">
        {specs.map((spec, i) => {
          const Icon = spec.icon;
          const value =
            spec.key === "km"
              ? `${Number(car[spec.key]).toLocaleString("pt-BR")} km`
              : String(car[spec.key]);

          return (
            <motion.div
              key={spec.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
              className={`rounded-xl p-4 border ${spec.colorClass} transition-shadow hover:shadow-md`}
            >
              <div className="flex text-white items-center gap-2 mb-1.5">
                <Icon className="w-4 h-4 text-white" />
                <span className="text-xs  font-semibold uppercase tracking-wide opacity-80 text-white">
                  {spec.label}
                </span>
              </div>
              <p className="text-xl font-bold text-white">{value}</p>
            </motion.div>
          );
        })}
        {/* Cidade e Estado */}
        {car.city && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="rounded-xl p-4 border text-white bg-spec-blue/10 border-spec-blue/20 transition-shadow hover:shadow-md col-span-2"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide opacity-80 text-white">
                Cidade
              </span>
            </div>
            <p className="text-xl font-bold text-white">
              {car.city}
              {car.state ? ` - ${car.state}` : ""}
            </p>
          </motion.div>
        )}
      </div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-5"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white mb-1">
            {car.name}
          </h1>
          <p className="text-zinc-300 text-base">
            {car.brand} • {car.year}
          </p>
        </div>
        <div className="">
          <p className="text-zinc-400 text-xs uppercase tracking-wider mb-0.5">
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
      <CarHighlights />
    </div>
  );
};

export default CarSpecs;
