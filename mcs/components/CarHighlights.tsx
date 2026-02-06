import { DollarSign, ShieldCheck, ArrowLeftRight } from "lucide-react";
import { motion } from "framer-motion";

const highlights = [
  {
    icon: DollarSign,
    title: "Aceita Financiamento",
    desc: "Parcele em até 60x",
    colorClass: "bg-spec-blue/10 text-spec-blue",
  },
  {
    icon: ShieldCheck,
    title: "Garantia",
    desc: "Veículo revisado",
    colorClass: "bg-spec-green/10 text-spec-green",
  },
  {
    icon: ArrowLeftRight,
    title: "Aceita Troca",
    desc: "Avaliamos seu usado",
    colorClass: "bg-spec-amber/10 text-spec-amber",
  },
];

const CarHighlights = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {highlights.map((h, i) => {
        const Icon = h.icon;
        return (
          <motion.div
            key={h.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
            className="bg-card rounded-xl shadow-sm border border-border p-5 text-center hover:shadow-md transition-shadow"
          >
            <div
              className={`w-11 h-11 rounded-full ${h.colorClass} flex items-center justify-center mx-auto mb-3`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">{h.title}</h3>
            <p className="text-muted-foreground text-sm">{h.desc}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CarHighlights;
