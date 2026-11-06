import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthFrame } from "@/components/auth/AuthFrame";

export const metadata: Metadata = {
  title: "Cadastrar",
  description: "Crie sua conta no ETTORE SEBASTIANINI INSTITUTO DE DESENVOLVIMENTO SOCIAL SUSTENTÁVEL.",
};

export default function PaginaCadastro() {
  return (
    <AuthFrame
      eyebrow="Faça parte"
      title="Crie sua conta"
      description="Cadastre-se para participar dos eventos e acompanhar as iniciativas do Instituto."
    >
      <Suspense>
        <RegisterForm />
      </Suspense>
    </AuthFrame>
  );
}
