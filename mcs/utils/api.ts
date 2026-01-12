// utils/api.ts
// Centraliza as funções de requisição para a API

const API_BASE = 'http://localhost:8080';

export async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  let headers = options?.headers || {};
  // Se o body for FormData, não define Content-Type
  if (options?.body && !(options.body instanceof FormData)) {
    headers = { ...headers, 'Content-Type': 'application/json' };
  }
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  return res.json();
}


