// utils/api.ts
// Centraliza as funções de requisição para a API

const API_BASE = 'https://mcs-api-0w2l.onrender.com';

export async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    },
  });
  if (!res.ok) {
    throw new Error(`Erro ao buscar ${endpoint}: ${res.status}`);
  }
  return res.json();
}


