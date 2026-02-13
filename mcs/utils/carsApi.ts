// Editar carro

// utils/carsApi.ts
import { get } from "http";
import { fetcher } from "./api";

async function createCar(name: string, brand: string, year: number, photos: [], gas: string, color: string, km: number, price: number, cityId: number) {
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
  // Adiciona todas as fotos
  photos.forEach((file, idx) => {
    formData.append('imagens', file); // backend deve aceitar array/imagens[]
  });

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
async function editCar(carId: string, data: { name?: string; brand?: string; year?: number; gas?: string; color?: string; km?: number; price?: number; photo?: []}) {
  console.log(data.photo);
  const formData = new FormData();
  if (data.name) formData.append('name', data.name);
  if (data.brand) formData.append('brand', data.brand);
  if (data.year !== undefined) formData.append('year', String(data.year));
  if (data.gas) formData.append('gas', data.gas);
  if (data.color) formData.append('color', data.color);
  if (data.km !== undefined) formData.append('km', String(data.km));
  if (data.price !== undefined) formData.append('price', String(data.price));
  if (data.photo) {
    data.photo.forEach((file, idx) => {
      formData.append('imagens', file); // backend deve aceitar array/imagens[]
    });
  }

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

// Deletar imagem de carro
async function deleteCarImage(carId: string, imageId: string) {
  // Exemplo de rota: /cars/deleteCarImage?carId=...&imageId=...
  return fetcher(`/cars/deleteCarImage/${carId}/${imageId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
}


async function searchCars(params: { name?: string; brand?: string; year?: string | number }) {
  const query = new URLSearchParams();
  if (params.name) query.append('name', params.name);
  if (params.brand) query.append('brand', params.brand);
  if (params.year) query.append('year', String(params.year));

  return fetcher(`/cars/search?${query}`, {
    method: 'GET',
    credentials: 'include',
  });
}

async function getUserCars(id: string) {
  return fetcher(`/cars/getUserCars/${id}`, {
    method: 'GET',
    credentials: "include",
  });
}

async function getCities() {
  return fetcher('/citys/getCities/', {
    method: 'GET',
    credentials: "include",
  });
}

export default {
  createCar,
  getAllCars,
  getCarById,
  editCar,
  deleteCar,
  deleteCarImage,
  searchCars,
  getUserCars,
  getCities,
};

// Adicione outras funções relacionadas a carros aqui
