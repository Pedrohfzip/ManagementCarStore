import { FaCalendarAlt, FaTachometerAlt, FaPalette } from "react-icons/fa";

export default function CarCard({ car }: { car: any }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Imagem do carro */}
      <div className="relative h-48 overflow-hidden bg-slate-200">
        <img 
          src={car?.photo || car?.imagem || car?.image || '/car-placeholder.png'}
          alt={`${car?.brand || car?.marca} ${car?.name || car?.nome}`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Informações do carro */}
      <div className="p-6">
        {/* Nome e Marca */}
        <div className="mb-4">
          <h2 className="text-slate-800 text-lg font-bold">{car?.brand || car?.marca} {car?.name || car?.nome}</h2>
          <p className="text-slate-500 text-sm mt-1">{car?.brand || car?.marca}</p>
        </div>

        {/* Detalhes */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-3 text-slate-600">
            <FaCalendarAlt className="w-5 h-5 text-blue-500" />
            <span className="text-sm">Ano: <span className="font-medium">{car?.year || car?.ano}</span></span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <FaTachometerAlt className="w-5 h-5 text-green-500" />
            <span className="text-sm">Quilometragem: <span className="font-medium">{(car?.km || 0).toLocaleString('pt-BR')} km</span></span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <FaPalette className="w-5 h-5 text-purple-500" />
            <span className="text-sm">Cor: <span className="font-medium">{car?.color || car?.cor}</span></span>
          </div>
        </div>

        {/* Preço e botão */}
        <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Preço</p>
            <p className="text-green-600 font-semibold text-xl">{car?.price || car?.preco || 'R$ --'}</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors duration-200">
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  );
}
