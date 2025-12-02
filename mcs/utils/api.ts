// utils/api.ts
// Centraliza as funções de requisição para a API

const API_BASE = 'http://localhost:8080';

export async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}


