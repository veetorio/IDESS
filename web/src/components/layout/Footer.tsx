import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Share2, Globe, Users } from "lucide-react";

const ANO_ATUAL = new Date().getFullYear();

const linksSite = [
  { href: "/", label: "Início" },
  { href: "/#sobre", label: "Sobre o Instituto" },
  { href: "/#fundadores", label: "Fundadores" },
  { href: "/#programas", label: "Programas" },
  { href: "/eventos", label: "Eventos" },
  { href: "/#contato", label: "Contato" },
];

const redesSociais = [
  {
    href: "https://instagram.com",
    label: "Instagram do Instituto",
    icon: Share2,
  },
  {
    href: "https://facebook.com",
    label: "Facebook do Instituto",
    icon: Users,
  },
  {
    href: "https://linkedin.com",
    label: "LinkedIn do Instituto",
    icon: Globe,
  },
];

export function Footer() {
  const anoAtual = ANO_ATUAL;

  return (
    <footer className="bg-primary text-white" aria-label="Rodapé">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.3fr_0.7fr_1fr] md:gap-16">
          {/* Coluna 1 — Institucional */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center bg-white p-1">
                <Image
                  src="/logo.png"
                  alt=""
                  width={36}
                  height={36}
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="font-bold leading-tight tracking-wide">
                ETTORE SEBASTIANINI
                <span className="block text-[10px] font-normal uppercase text-white/70">
                  Instituto de Desenvolvimento
                  <br />
                  Social Sustentável
                </span>
              </span>
            </div>

            <p className="max-w-sm text-sm leading-6 text-white/80">
              Transformando vidas através de iniciativas sociais e sustentáveis,
              promovendo o desenvolvimento humano e a inclusão social.
            </p>

            {/* Redes sociais */}
            <div className="mt-6 flex items-center gap-2">
              {redesSociais.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center border border-white/25 text-white transition-colors hover:border-green-light hover:bg-white/10"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Coluna 2 — Links do site */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-green-light">
              Navegação
            </h3>
            <nav aria-label="Links do rodapé">
              <ul className="space-y-3">
                {linksSite.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Coluna 3 — Contato */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-green-light">
              Contato
            </h3>
            <address className="not-italic space-y-3">
              <a
                href="mailto:contato@institutoettore.org.br"
                className="flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0 text-green" aria-hidden="true" />
                contato@institutoettore.org.br
              </a>
              <a
                href="tel:+5511999999999"
                className="flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 shrink-0 text-green" aria-hidden="true" />
                 (98) 98915-5803
              </a>
              <p className="flex items-start gap-2 text-sm text-white/80">
                <MapPin className="h-4 w-4 shrink-0 text-green mt-0.5" aria-hidden="true" />
                São Luís, MA — Brasil
              </p>
            </address>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/20 pt-6 text-xs leading-5 text-white/70 sm:flex-row sm:items-center">
          <p>
            © {anoAtual} ETTORE SEBASTIANINI INSTITUTO DE DESENVOLVIMENTO SOCIAL SUSTENTÁVEL.
            Todos os direitos reservados.
          </p>
          <p>Compromisso com um futuro mais justo e sustentável.</p>
        </div>
      </div>
    </footer>
  );
}
