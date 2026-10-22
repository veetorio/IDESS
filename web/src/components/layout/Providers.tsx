"use client";

import { AuthProvider } from "@/hooks/useAuth";

/**
 * Componente client que agrupa todos os Context Providers da aplicação.
 * Separado para que o layout raiz (Server Component) possa importá-lo
 * sem quebrar a renderização no servidor.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
