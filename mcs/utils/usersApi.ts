
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
async function registerUser(name: string, email: string, senha: string, role: string) {
  return fetcher('/users/register/', {
    method: 'POST',
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, senha, role }),
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

async function getUserById(id: string) {
  return fetcher(`/users/${id}`, {
    method: 'GET',
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
  });
}

async function getAuthenticatedUser() {
  return fetcher('/users/authenticatedUser', {
    method: 'GET',
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
  });
}
async function logoutUser(){
  return fetcher('/token/logout/', {
    method: 'POST',
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
  });
}
async function refreshToken() {
  return fetcher('/token/refresh/', {
    method: 'POST',
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
  });
}

async function searchUsers(params: { data:any}) {
  const query = new URLSearchParams();
  if (params.data) query.append('data', params.data);

  return fetcher(`/users/search?${query}`, {
    method: 'GET',
    credentials: 'include',
  });
}

// Adicione outras funções relacionadas a usuários aqui

export default {
  getUsers,
  loginUser,
  registerUser,
  deleteUser,
  getAllUsers,
  getAuthenticatedUser,
  logoutUser,
  refreshToken,
  getUserById,
};

// Adicione outras funções relacionadas a usuários aqui
