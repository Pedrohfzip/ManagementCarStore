import { motion } from "framer-motion";
import { Calendar, Droplet, Gauge, Palette } from "lucide-react";
import type { Car } from "@/data/mockCar";

interface CarSpecsProps {
  car: Car;
}

const specs = [
  { key: "year" as const, label: "Ano", icon: Calendar, colorClass: "text-spec-blue bg-spec-blue/10 border-spec-blue/20" },
  { key: "gas" as const, label: "Combustível", icon: Droplet, colorClass: "text-spec-green bg-spec-green/10 border-spec-green/20" },
  { key: "km" as const, label: "Quilometragem", icon: Gauge, colorClass: "text-spec-amber bg-spec-amber/10 border-spec-amber/20" },
  { key: "color" as const, label: "Cor", icon: Palette, colorClass: "text-spec-rose bg-spec-rose/10 border-spec-rose/20" },
];

const CarSpecs = ({ car }: CarSpecsProps) => {
  return (
    <div>
      <h2 className="text-2xl font-display font-bold text-foreground mb-4">
        Especificações
      </h2>
      <div className="grid grid-cols-2 gap-3">
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
              <div className="flex items-center gap-2 mb-1.5">
                <Icon className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wide opacity-80">
                  {spec.label}
                </span>
              </div>
              <p className="text-xl font-bold text-foreground">{value}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CarSpecs;
