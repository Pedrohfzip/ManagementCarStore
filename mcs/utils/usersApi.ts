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
async function registerUser(email: string, senha: string, name: string) {
  return fetcher('/users/register/', {
    method: 'POST',
    body: JSON.stringify({ email, senha, name }),
  });
}

// Adicione outras funções relacionadas a usuários aqui

export default {
  getUsers,
  loginUser,
  registerUser,
};

// Adicione outras funções relacionadas a usuários aqui
