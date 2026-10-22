"use client";

import { useSearchParams } from "next/navigation";
import { LoginForm } from "./LoginForm";

/**
 * Wrapper client-side para ler o searchParam "redirect"
 * e passá-lo para o LoginForm. Separado para não forçar
 * toda a página de login a ser client-side.
 */
export function LoginFormWrapper() {
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/";

  return <LoginForm redirect={redirect} />;
}
