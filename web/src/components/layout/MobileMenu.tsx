"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, User, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { href: "/#sobre", label: "Sobre" },
  { href: "/#fundadores", label: "Fundadores" },
  { href: "/#programas", label: "Programas" },
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
      {/* Botão hambúrguer */}
      <Button
        variant="ghost"
        size="icon"
        aria-label={aberto ? "Fechar menu" : "Abrir menu"}
        aria-expanded={aberto}
        aria-controls="menu-mobile"
        onClick={() => setAberto((v) => !v)}
        className="text-white hover:bg-white/10"
      >
        {aberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Painel de navegação */}
      {aberto && (
        <nav
          id="menu-mobile"
          className="absolute left-0 right-0 top-full z-50 border-t border-white/20 bg-primary text-white shadow-lg"
          aria-label="Menu de navegação mobile"
        >
          <ul className="flex flex-col py-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={fechar}
                  className="block px-6 py-3 text-base font-medium transition-colors hover:bg-white/10"
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Ações de autenticação */}
            <li className="px-6 pt-4 pb-2 border-t border-base/20 mt-2 space-y-2">
              {usuario ? (
                <>
                  {usuario.role === "ADMIN" && (
                    <Link
                      href="/admin/eventos"
                      onClick={fechar}
                      className="flex w-full items-center gap-2 rounded-lg bg-green px-4 py-2.5 font-medium text-white transition-colors hover:bg-green-dark"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      Administrar eventos
                    </Link>
                  )}
                  <Link
                    href="/minha-conta"
                    onClick={fechar}
                    className="flex w-full items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-center font-medium transition-colors hover:bg-white/20"
                  >
                    <User className="h-4 w-4" aria-hidden="true" />
                    {usuario.nome?.split(" ")[0]}
                  </Link>
                  <button
                    onClick={() => {
                      fechar();
                      void logout();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-center font-medium text-white/80 transition-colors hover:bg-white/10"
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
                    className="block w-full text-center py-2.5 px-6 bg-green text-white font-semibold rounded-lg hover:bg-green-dark transition-colors"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/cadastrar"
                    onClick={fechar}
                    className="block w-full rounded-lg border border-white/30 px-6 py-2.5 text-center font-medium text-white transition-colors hover:bg-white/10"
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
