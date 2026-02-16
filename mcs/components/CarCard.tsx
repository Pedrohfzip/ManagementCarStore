import { FaCalendarAlt, FaTachometerAlt, FaPalette, FaUser, FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";

export default function CarCard({ car }: { car: any }) {
  console.log(car?.userName);
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full">
      {/* Imagem do carro */}
      <div className="relative h-28 overflow-hidden bg-slate-200">
        <img
          src={Array.isArray(car?.images) && car.images.length > 0 ? car.images[0].imageUrl : "/car-placeholder.png"}
          alt={`${car?.brand || car?.marca} ${car?.name || car?.nome}`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Informações do carro */}
      <div className="p-3">
        {/* Nome e Marca */}
        <div className="mb-2">
          <h2 className="text-slate-800 text-base font-bold truncate">{car?.brand || car?.marca} {car?.name || car?.nome}</h2>
          <p className="text-slate-500 text-xs mt-1 truncate">{car?.brand || car?.marca}</p>
        </div>

        {/* Preço e botão */}
        <div className="border-t border-slate-200 pt-2 flex items-center ">
          <div className="">
            <p className="text-xs text-slate-500">Preço</p>
            <p className="text-green-600 font-semibold text-lg">
              {typeof car?.price === "number" || typeof car?.preco === "number"
                ? `R$ ${Number(car?.price ?? car?.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                : (car?.price || car?.preco || "R$ --")}
            </p>
          </div>
        </div>
        <div className="flex text-black pt-1 pb-1 ">
            <p className="text-sm flex"><FaMapMarkerAlt/>{car.city}</p>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center">
            <FaUser className="w-4 h-4 text-slate-500 mr-1" />
            <span className="flex text-xs text-black items-center">{car?.userName}</span>
          </div>
          <div className="flex items-center">
            <Link
              href={`/Car?id=${car?.id}`}
              className="  text-black font-semibold   rounded-md text-xs transition-colors duration-200"
            >
              Detalhes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
