// utils/carsApi.ts
import { fetcher } from "./api";

async function createCar(name: string, brand: string, year: number, photo: File | null) {
  const data = {
    name,
    brand,
    year,
    photo,
  }

  return fetcher('/cars/createCar/', {
    method: 'POST',
    credentials: "include",
    body: JSON.stringify(data),
  });
}

export default {
  createCar,
};

// Adicione outras funções relacionadas a carros aqui
