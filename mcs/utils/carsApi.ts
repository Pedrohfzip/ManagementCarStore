// Editar carro

// utils/carsApi.ts
import { get } from "http";
import { fetcher } from "./api";

async function createCar(name: string, brand: string, year: number, photo: File | null, gas: string, color: string, km: number, price: number) {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('brand', brand);
  formData.append('year', String(year));
  formData.append('gas', gas);
  formData.append('color', color);
  formData.append('km', String(km));
  if (price !== undefined) {
    formData.append('price', String(price));
  }
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
async function getCarById(carId: string) {
  return fetcher(`/cars/getCar/${carId}/`, {
    method: 'GET',
    credentials: "include",
  });
}
async function editCar(carId: string, data: { name?: string; brand?: string; year?: number; gas?: string; color?: string; km?: number; price?: number; photo?: File | null }) {
  const formData = new FormData();
  if (data.name) formData.append('name', data.name);
  if (data.brand) formData.append('brand', data.brand);
  if (data.year !== undefined) formData.append('year', String(data.year));
  if (data.gas) formData.append('gas', data.gas);
  if (data.color) formData.append('color', data.color);
  if (data.km !== undefined) formData.append('km', String(data.km));
  if (data.price !== undefined) formData.append('price', String(data.price));
  if (data.photo) formData.append('imagem', data.photo);
  return fetcher(`/cars/editCar/${carId}`, {
    method: 'PUT',
    credentials: 'include',
    body: formData,
  });
}

// Deletar carro
async function deleteCar(carId: string) {
  return fetcher(`/cars/deleteCar/${carId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
}


async function searchCars(params: { data:any}) {
  const query = new URLSearchParams();
  if (params.data) query.append('data', params.data);

  return fetcher(`/cars/search?${query}`, {
    method: 'GET',
    credentials: 'include',
  });
}

export default {
  createCar,
  getAllCars,
  getCarById,
  editCar,
  deleteCar,
  searchCars,
};

// Adicione outras funções relacionadas a carros aqui
