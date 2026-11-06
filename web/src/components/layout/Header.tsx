import Link from "next/link";
import { MobileMenu } from "./MobileMenu";
import { HeaderActions } from "./HeaderActions";
import Image from "next/image";

const navLinks = [
  { href: "/#sobre", label: "Sobre" },
  { href: "/#fundadores", label: "Fundadores" },
  { href: "/#programas", label: "Programas" },
  { href: "/projetos", label: "Projetos" },
  { href: "/eventos", label: "Eventos" },
  { href: "/#patrocinadores", label: "Patrocinadores" },
  { href: "/#contato", label: "Contato" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-primary/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-[4.75rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-3 font-bold text-primary transition-opacity hover:opacity-80"
          aria-label="ETTORE SEBASTIANINI INSTITUTO DE DESENVOLVIMENTO SOCIAL SUSTENTÁVEL — Página inicial"
        >
          <Image
            src="/logo.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 shrink-0"
          />

          <span className="hidden leading-tight sm:block">
            ETTORE SEBASTIANINI
            <span className="mt-1 block text-[9px] font-medium uppercase tracking-wide text-neutral-600">
              Instituto de Desenvolvimento Social Sustentável
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 xl:flex"
          aria-label="Navegação principal"
        >
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-md px-2.5 py-2 text-[13px] font-semibold text-neutral-700 transition-colors hover:bg-base hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <HeaderActions />
        <MobileMenu />
      </div>
    </header>
  );
}
