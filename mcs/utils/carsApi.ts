// utils/carsApi.ts
import { fetcher } from "./api";

export async function getCarros() {
  return fetcher('/carros');
}

// Adicione outras funções relacionadas a carros aqui
