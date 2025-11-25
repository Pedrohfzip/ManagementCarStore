// utils/usersApi.ts
import { fetcher } from "./api";


async function getUsers() {
  return fetcher('/users/');
}

async function loginUser(email: string, senha: string) {
  return fetcher('/users/login/', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });
}
async function registerUser(name: string, email: string, senha: string) {
  return fetcher('/users/register/', {
    method: 'POST',
    body: JSON.stringify({ name, email, senha }),
  });
}
async function deleteUser(userId: string) {
  return fetcher(`/users/${userId}/`, {
    method: 'DELETE',
  });
}

// Adicione outras funções relacionadas a usuários aqui

export default {
  getUsers,
  loginUser,
  registerUser,
  deleteUser,
};

// Adicione outras funções relacionadas a usuários aqui
