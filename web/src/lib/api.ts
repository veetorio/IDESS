import type { ApiError } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

interface RequestOptions extends RequestInit {
  token?: string;
}

/**
 * Wrapper centralizado para chamadas à API Spring.
 * Adiciona headers padrão, token JWT e tratamento de erros padronizado.
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, headers, ...rest } = options;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    let errorMessage = `Erro ${response.status}: ${response.statusText}`;
    try {
      const errorBody: ApiError = await response.json();
      errorMessage = errorBody.message ?? errorMessage;
    } catch {
      // Mantém a mensagem padrão se o body não for JSON
    }
    throw new Error(errorMessage);
  }

  // Resposta 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// ----------------------
// Métodos HTTP
// ----------------------

export const api = {
  get<T>(endpoint: string, options?: RequestOptions) {
    return request<T>(endpoint, { ...options, method: "GET" });
  },

  post<T>(endpoint: string, body: unknown, options?: RequestOptions) {
    return request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put<T>(endpoint: string, body: unknown, options?: RequestOptions) {
    return request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  delete<T>(endpoint: string, options?: RequestOptions) {
    return request<T>(endpoint, { ...options, method: "DELETE" });
  },
};
