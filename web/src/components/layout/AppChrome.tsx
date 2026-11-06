"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FolderKanban,
  LogOut,
  Mail,
  Menu,
  Plus,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Footer } from "./Footer";
import { Header } from "./Header";

const linksAdmin = [
  { href: "/admin/dashboard", label: "Dashboard", Icon: BarChart3 },
  { href: "/admin/eventos", label: "Eventos", Icon: Plus },
  { href: "/admin/projetos", label: "Projetos", Icon: FolderKanban },
  { href: "/admin/newsletter", label: "Newsletter", Icon: Mail },
];

interface AppChromeProps {
  children: React.ReactNode;
}

export function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const { usuario, carregando, logout } = useAuth();
  const [colapsada, setColapsada] = useState(false);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const estaNaAdministracao = pathname.startsWith("/admin");

  if (!estaNaAdministracao) {
    const paginaAutenticacao =
      pathname === "/entrar" || pathname === "/cadastrar" || pathname.startsWith("/entrar/");

    if (paginaAutenticacao) {
      return <main className="flex-1">{children}</main>;
    }

    return (
      <>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </>
    );
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-base" aria-label="Carregando painel administrativo">
        <div className="h-16 animate-pulse bg-primary/10" />
      </div>
    );
  }

  if (usuario?.role !== "ADMIN") {
    return <main className="min-h-screen">{children}</main>;
  }

  const larguraSidebar = colapsada ? "lg:w-[5.25rem]" : "lg:w-64";

  return (
    <div className="min-h-screen bg-base lg:flex">
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-primary/10 bg-white px-4 text-primary lg:hidden">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
          <Image src="/logoWhite.png" alt="" width={32} height={32} />
          <span>Painel admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setMenuMobileAberto((aberto) => !aberto)}
          aria-label={menuMobileAberto ? "Fechar menu administrativo" : "Abrir menu administrativo"}
          aria-expanded={menuMobileAberto}
          aria-controls="admin-sidebar-mobile"
          className="rounded-lg p-2 transition-colors hover:bg-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {menuMobileAberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuMobileAberto && (
        <button
          type="button"
          aria-label="Fechar menu administrativo"
          onClick={() => setMenuMobileAberto(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      <aside
        id="admin-sidebar-mobile"
        aria-label="Navegação administrativa"
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-neutral-200 bg-white text-neutral-800 shadow-xl transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none ${larguraSidebar} ${
          menuMobileAberto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className={`flex h-20 items-center border-b border-neutral-200 ${colapsada ? "justify-center px-2" : "gap-3 px-5"}`}>
          <Link
            href="/admin/dashboard"
            className="flex min-w-0 items-center gap-3"
            aria-label="ETTORE — painel administrativo"
          >
            <Image src="/logo.png" alt="" width={40} height={40} className="shrink-0" />
            {!colapsada && (
              <span className="min-w-0 text-sm font-bold leading-tight">
                ETTORE
                <span className="mt-1 block text-[10px] font-normal text-neutral-500">
                  Painel administrativo
                </span>
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setMenuMobileAberto(false)}
            aria-label="Fechar menu administrativo"
            className="ml-auto rounded-lg p-2 hover:bg-neutral-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {linksAdmin.map(({ href, label, Icon }) => {
            const ativo = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuMobileAberto(false)}
                aria-current={ativo ? "page" : undefined}
                title={colapsada ? label : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  ativo ? "bg-base text-primary" : "text-neutral-700 hover:bg-neutral-100 hover:text-primary"
                } ${colapsada ? "justify-center" : ""}`}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {!colapsada && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-neutral-200 p-3">
          <Link
            href="/"
            onClick={() => setMenuMobileAberto(false)}
            title={colapsada ? "Ver site" : undefined}
            className={`flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-primary ${
              colapsada ? "justify-center" : ""
            }`}
          >
            <ExternalLink className="h-5 w-5 shrink-0" aria-hidden="true" />
            {!colapsada && <span>Ver site</span>}
          </Link>
          <button
            type="button"
            onClick={() => void logout()}
            title={colapsada ? "Sair" : undefined}
            className={`flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              colapsada ? "justify-center" : ""
            }`}
          >
            <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
            {!colapsada && <span>Sair</span>}
          </button>
          <div className={`flex items-center gap-3 px-3 py-3 text-xs text-neutral-600 ${colapsada ? "justify-center px-0" : ""}`}>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
              {usuario.nome.slice(0, 1).toUpperCase()}
            </span>
            {!colapsada && <span className="truncate">{usuario.nome}</span>}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setColapsada((atual) => !atual)}
          aria-label={colapsada ? "Expandir barra lateral" : "Recolher barra lateral"}
          aria-expanded={!colapsada}
          className="hidden h-12 items-center justify-center border-t border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-primary lg:flex"
        >
          {colapsada ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          {!colapsada && <span className="ml-2 text-xs">Recolher menu</span>}
        </button>
      </aside>

      <main className="min-h-[calc(100vh-4rem)] min-w-0 flex-1 lg:min-h-screen">
        {children}
      </main>
    </div>
  );
}
