// utils/usersApi.ts
import { fetcher } from "./api";


async function getUsers() {
  return fetcher('/users/');
}

async function loginUser(email: string, senha: string) {
  return fetcher('/users/login/', {
    method: 'POST',
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, senha }),
  });
}
async function registerUser(name: string, email: string, senha: string) {
  return fetcher('/users/register/', {
    method: 'POST',
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, senha }),
  });
}
async function deleteUser(userId: string) {
  return fetcher(`/users/${userId}/`, {
    method: 'DELETE',
  });
}

async function getAllUsers() {
  return fetcher('/users/allUsers', {
    method: 'GET',
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
  });
}

// Adicione outras funções relacionadas a usuários aqui

export default {
  getUsers,
  loginUser,
  registerUser,
  deleteUser,
  getAllUsers,
};

// Adicione outras funções relacionadas a usuários aqui
