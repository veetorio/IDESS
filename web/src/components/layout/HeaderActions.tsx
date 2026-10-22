"use client";

import Link from "next/link";
import { LogOut, User, CalendarCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function HeaderActions() {
  const { usuario, carregando, logout } = useAuth();

  // Evita flash de conteúdo durante hidratação
  if (carregando) {
    return (
      <div className="hidden items-center gap-2 xl:flex">
        <div className="h-8 w-20 rounded-lg bg-base/10 animate-pulse" />
        <div className="h-8 w-24 rounded-lg bg-base/10 animate-pulse" />
      </div>
    );
  }

  if (usuario) {
    return (
      <div className="hidden items-center gap-3 xl:flex">
        {/* Nome do usuário */}
        <span className="hidden text-sm text-white/80 xl:block">
          Olá, <span className="font-semibold text-white">{usuario.nome.split(" ")[0]}</span>
        </span>

        {/* Link para inscrições */}
        <Button variant="ghost" size="sm" asChild className="text-white/80 hover:text-white">
          <Link href="/minha-conta">
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            Minhas inscrições
          </Link>
        </Button>

        {/* Logout */}
        <Button
          variant="outline-white"
          size="sm"
          onClick={logout}
          aria-label="Sair da conta"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sair
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-2 xl:flex">
      <Button variant="outline-white" size="sm" asChild>
        <Link href="/entrar">
          <User className="h-4 w-4" aria-hidden="true" />
          Entrar
        </Link>
      </Button>
      <Button variant="success" size="sm" asChild>
        <Link href="/cadastrar">Cadastrar</Link>
      </Button>
    </div>
  );
}
