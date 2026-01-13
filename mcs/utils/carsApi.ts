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

async function getAllCars() {
  return fetcher('/cars/getAllCars/', {
    method: 'GET',
    credentials: "include",
  });
}

export default {
  createCar,
  getAllCars,
};

// Adicione outras funções relacionadas a carros aqui
