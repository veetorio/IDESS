import type { Conta } from "@/types";

/**
 * Decodifica o payload de um JWT sem verificar a assinatura.
 * A verificação real acontece no servidor (API Route / middleware).
 */
export function decodeToken(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Verifica se um token JWT expirou (client-side, sem verificar assinatura).
 */
export function tokenExpirado(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload || typeof payload.exp !== "number") return true;
  return Date.now() >= payload.exp * 1000;
}

/**
 * Extrai informações básicas do usuário a partir do payload do JWT.
 * Assume que o backend inclui id, nome, email e role no token.
 */
export function usuarioDoToken(token: string): Partial<Conta> | null {
  const payload = decodeToken(token);
  if (!payload) return null;

  return {
    id: payload.sub as string,
    nome: payload.nome as string,
    role: payload.role as Conta["role"],
  };
}
