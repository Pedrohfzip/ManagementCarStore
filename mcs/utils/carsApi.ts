// utils/carsApi.ts
import { fetcher } from "./api";

async function createCar(name: string, brand: string, year: number, photo: File | null, gas: string, color: string, km: number) {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('brand', brand);
  formData.append('year', String(year));
  formData.append('gas', gas);
  formData.append('color', color);
  formData.append('km', String(km));
  if (photo) {
    formData.append('imagem', photo); // nome do campo igual ao do backend
  }

  return fetch('http://localhost:8080/cars/createCar/', {
    method: 'POST',
    credentials: "include",
    body: formData,
  }).then(res => res.json());
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
