// utils/usersApi.ts
import { fetcher } from "./api";

export async function getUsers() {
  return fetcher('/users/');
}

// Adicione outras funções relacionadas a usuários aqui
