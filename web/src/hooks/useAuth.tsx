"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Conta, LoginPayload, RegisterPayload } from "@/types";
import { api } from "@/lib/api";

// =============================================
// Tipos do contexto de autenticação
// =============================================

interface AuthState {
  usuario: Conta | null;
  carregando: boolean;
}

interface AuthContextValue extends AuthState {
  login: (dados: LoginPayload, redirect?: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (dados: RegisterPayload) => Promise<void>;
}

// =============================================
// Contexto
// =============================================

const AuthContext = createContext<AuthContextValue | null>(null);

// =============================================
// Provider
// =============================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    usuario: null,
    carregando: true,
  });

  // Ao montar, busca os dados do usuário atual via API Route
  useEffect(() => {
    async function verificarSessao() {
      try {
        const usuario = await api.get<Conta>("/api/auth/me");
        setState({ usuario, carregando: false });
      } catch {
        // Cookie ausente ou inválido — usuário não autenticado
        setState({ usuario: null, carregando: false });
      }
    }
    verificarSessao();
  }, []);

  const login = useCallback(
    async (dados: LoginPayload, redirect = "/") => {
      const { usuario } = await api.post<{ usuario: Conta }>(
        "/api/auth/login",
        dados
      );
      setState({ usuario, carregando: false });
      // Navegação do lado do cliente
      window.location.href = redirect;
    },
    []
  );

  const logout = useCallback(async () => {
    await api.post("/api/auth/logout", {});
    setState({ usuario: null, carregando: false });
    window.location.href = "/";
  }, []);

  const register = useCallback(async (dados: RegisterPayload) => {
    await api.post("/api/auth/register", dados);
    // Após cadastro, redireciona para login
    window.location.href = "/entrar?cadastro=ok";
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

// =============================================
// Hook de consumo
// =============================================

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }
  return ctx;
}
