import Link from "next/link";
import { MobileMenu } from "./MobileMenu";
import { HeaderActions } from "./HeaderActions";
import Image from "next/image";

const navLinks = [
  { href: "/#sobre", label: "Sobre" },
  { href: "/#fundadores", label: "Fundadores" },
  { href: "/#programas", label: "Programas" },
  { href: "/eventos", label: "Eventos" },
  { href: "/#patrocinadores", label: "Patrocinadores" },
  { href: "/#contato", label: "Contato" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 isolate w-full bg-primary shadow-md">
      <div className="header-art" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo / Nome do Instituto */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 font-bold text-white transition-opacity hover:opacity-90"
          aria-label="Instituto Ettore Sebastianini — Página inicial"
        >
          <Image
            src="/logoWhite.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10"
          />

          <span className="hidden leading-tight sm:block">
            Ettore Sebastianini
            <span className="block text-xs font-normal text-white/75">
              Instituto Social e Sustentável
            </span>
          </span>
        </Link>

        {/* Navegação desktop */}
        <nav
          className="hidden items-center gap-1 xl:flex"
          aria-label="Navegação principal"
        >
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Ações (login/perfil) — client component separado */}
        <HeaderActions />

        {/* Menu mobile */}
        <MobileMenu />
      </div>
    </header>
  );
}
