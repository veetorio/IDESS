"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, User, LogOut, Plus, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { href: "/#sobre", label: "Sobre" },
  { href: "/#fundadores", label: "Fundadores" },
  { href: "/#programas", label: "Programas" },
  { href: "/projetos", label: "Projetos" },
  { href: "/eventos", label: "Eventos" },
  { href: "/#patrocinadores", label: "Patrocinadores" },
  { href: "/#contato", label: "Contato" },
];

export function MobileMenu() {
  const { usuario, logout } = useAuth();
  const [aberto, setAberto] = useState(false);

  function fechar() {
    setAberto(false);
  }

  return (
    <div className="xl:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label={aberto ? "Fechar menu" : "Abrir menu"}
        aria-expanded={aberto}
        aria-controls="menu-mobile"
        onClick={() => setAberto((v) => !v)}
        className="text-primary hover:bg-base"
      >
        {aberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {aberto && (
        <nav
          id="menu-mobile"
          className="absolute left-0 right-0 top-full z-50 border-t border-neutral-200 bg-white text-neutral-900 shadow-lg"
          aria-label="Menu de navegação mobile"
        >
          <ul className="flex flex-col py-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={fechar}
                  className="block px-6 py-3 text-base font-medium transition-colors hover:bg-base hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Ações de autenticação */}
            <li className="mt-2 space-y-2 border-t border-neutral-200 px-6 pt-4 pb-2">
              {usuario ? (
                <>
                  {usuario.role === "ADMIN" && (
                    <>
                      <Link
                        href="/admin/dashboard"
                        onClick={fechar}
                        className="flex min-h-11 w-full items-center gap-2 rounded-lg bg-base px-4 py-2.5 font-medium text-primary transition-colors hover:bg-primary/10"
                      >
                        <BarChart3 className="h-4 w-4" aria-hidden="true" />
                        Dashboard
                      </Link>

                      <Link
                        href="/admin/projetos"
                        onClick={fechar}
                        className="flex min-h-11 w-full items-center gap-2 rounded-lg bg-base px-4 py-2.5 font-medium text-primary transition-colors hover:bg-primary/10"
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Administrar projetos
                      </Link>

                      <Link
                        href="/admin/eventos"
                        onClick={fechar}
                        className="flex min-h-11 w-full items-center gap-2 rounded-lg bg-green-dark px-4 py-2.5 font-medium text-white transition-colors hover:bg-[#0b5b28]"
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Administrar eventos
                      </Link>
                    </>
                  )}
                  <Link
                    href="/minha-conta"
                    onClick={fechar}
                    className="flex min-h-11 w-full items-center gap-2 rounded-lg bg-base px-4 py-2.5 font-medium text-primary transition-colors hover:bg-primary/10"
                  >
                    <User className="h-4 w-4" aria-hidden="true" />
                    {usuario.nome?.split(" ")[0]}
                  </Link>
                  <button
                    onClick={() => {
                      fechar();
                      void logout();
                    }}
                    className="flex min-h-11 w-full items-center gap-2 rounded-lg px-4 py-2.5 font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/entrar"
                    onClick={fechar}
                    className="block min-h-11 w-full rounded-lg bg-green-dark px-6 py-2.5 text-center font-semibold text-white transition-colors hover:bg-[#0b5b28]"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/cadastrar"
                    onClick={fechar}
                    className="block min-h-11 w-full rounded-lg border border-primary px-6 py-2.5 text-center font-medium text-primary transition-colors hover:bg-base"
                  >
                    Cadastrar
                  </Link>
                </>
              )}
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
