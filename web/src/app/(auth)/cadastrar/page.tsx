import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Cadastrar",
  description: "Crie sua conta no Instituto Ettore Sebastianini.",
};

export default function PaginaCadastro() {
  return (
    <div className="min-h-screen bg-base flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        {/* Cabeçalho */}
        <div className="text-center mb-8 flex flex-col items-center">
          <span>
            <Image src="/logo.png" alt="Logo do Instituto Ettore Sebastianini" width={64} height={64} />
          </span>
          <h1 className="text-2xl font-bold text-primary">Crie sua conta</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Cadastre-se para participar dos nossos eventos.
          </p>
        </div>

        {/* Card do formulário */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
          <Suspense>
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
