"use client";

import Link from "next/link";
import { LogOut, User, CalendarCheck, Plus, BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function HeaderActions() {
  const { usuario, carregando, logout } = useAuth();

  // Evita flash de conteúdo durante hidratação
  if (carregando) {
    return (
      <div className="hidden items-center gap-2 xl:flex">
        <div className="h-8 w-20 animate-pulse rounded-lg bg-neutral-100" />
        <div className="h-8 w-24 animate-pulse rounded-lg bg-neutral-100" />
      </div>
    );
  }

  if (usuario) {
    return (
      <div className="hidden items-center gap-2 xl:flex">
        {usuario.role !== "ADMIN" && (
          <span className="hidden text-sm text-neutral-600 xl:block">
            Olá,{" "}
            <span className="font-semibold text-primary">
              {usuario.nome.split(" ")[0]}
            </span>
          </span>
        )}

        <Button variant="ghost" size="sm" asChild>
          <Link href="/minha-conta">
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            Minhas inscrições
          </Link>
        </Button>

        {usuario.role === "ADMIN" && (
          <>
            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <Link href="/admin/projetos">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Projetos
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <Link href="/admin/dashboard">
                <BarChart3 className="h-4 w-4" aria-hidden="true" />
                Dashboard
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <Link href="/admin/eventos">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Painel de eventos
              </Link>
            </Button>
          </>
        )}

        <Button
          variant="outline"
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
      <Button variant="ghost" size="sm" asChild>
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
