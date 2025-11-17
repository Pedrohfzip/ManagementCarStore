import Image from "next/image";
import { Car } from "./cars";

export default function CarCard({ car }: { car: Car }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 flex flex-col items-center w-full h-full min-w-0">
      <div className="w-full flex justify-center">
        <Image
          src={car.imagem}
          alt={car.nome}
          width={320}
          height={180}
          className="rounded-md object-cover mb-2 w-full h-[140px] sm:h-[180px]"
        />
      </div>
      <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 text-center w-full break-words">{car.nome}</h2>
      <p className="text-zinc-600 mb-2 text-center text-sm sm:text-base w-full break-words">{car.descricao}</p>
      <span className="text-base sm:text-lg font-bold text-blue-600 mb-2">R$ {car.preco.toLocaleString("pt-BR")}</span>
      <button className="mt-auto px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition w-full sm:w-auto">Comprar</button>
    </div>
  );
}
