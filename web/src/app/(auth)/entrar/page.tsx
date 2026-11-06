import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginFormWrapper } from "@/components/auth/LoginFormWrapper";
import { AuthFrame } from "@/components/auth/AuthFrame";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse sua conta no ETTORE SEBASTIANINI INSTITUTO DE DESENVOLVIMENTO SOCIAL SUSTENTÁVEL.",
};

export default function PaginaLogin() {
  return (
    <AuthFrame
      eyebrow="Acesse sua conta"
      title="Bem-vindo de volta"
      description="Entre para acompanhar suas inscrições e as novidades do Instituto."
    >
      <Suspense>
        <LoginFormWrapper />
      </Suspense>
    </AuthFrame>
  );
}
