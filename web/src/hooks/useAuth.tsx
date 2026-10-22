"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { Conta, LoginPayload, RegisterPayload } from "@/types";

// ----------------------
// Tipos do contexto
// ----------------------

interface AuthContextValue {
  usuario: Conta | null;
  carregando: boolean;
  login: (dados: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  registrar: (dados: RegisterPayload) => Promise<void>;
}

// ----------------------
// Contexto
// ----------------------

const AuthContext = createContext<AuthContextValue | null>(null);

// ----------------------
// Provider
// ----------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Conta | null>(null);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  // Hidrata o estado a partir do cookie (via API Route /api/auth/me)
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(({ usuario }) => setUsuario(usuario ?? null))
      .catch(() => setUsuario(null))
      .finally(() => setCarregando(false));
  }, []);

  const login = useCallback(
    async (dados: LoginPayload) => {
      const resposta = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (!resposta.ok) {
        const erro = await resposta.json();
        throw new Error(erro.message ?? "Erro ao fazer login");
      }

      const { usuario } = await resposta.json();
      setUsuario(usuario);
      router.refresh();
    },
    [router]
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUsuario(null);
    router.push("/");
    router.refresh();
  }, [router]);

  const registrar = useCallback(
    async (dados: RegisterPayload) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

      const resposta = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (!resposta.ok) {
        const erro = await resposta.json().catch(() => ({}));
        throw new Error(
          (erro as { message?: string }).message ?? "Erro ao criar conta"
        );
      }
    },
    []
  );

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout, registrar }}>
      {children}
    </AuthContext.Provider>
  );
}

// ----------------------
// Hook
// ----------------------

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }
  return ctx;
}
