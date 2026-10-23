import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { LoginFormWrapper } from "@/components/auth/LoginFormWrapper";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse sua conta no ETTORE SEBASTIANINI INSTITUTO DE DESENVOLVIMENTO SOCIAL SUSTENTÁVEL.",
};

export default function PaginaLogin() {
  return (
    <div className="min-h-screen bg-base flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        {/* Cabeçalho */}
        <div className="text-center mb-8 flex items-center flex-col">
          <span>
            <Image src="/logo.png" alt="Logo do ETTORE SEBASTIANINI INSTITUTO DE DESENVOLVIMENTO SOCIAL SUSTENTÁVEL" width={64} height={64} />
          </span>
          <h1 className="text-2xl font-bold text-primary">Bem-vindo de volta</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Entre na sua conta para se inscrever em eventos.
          </p>
        </div>

        {/* Card do formulário */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
          <Suspense>
            <LoginFormWrapper />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
