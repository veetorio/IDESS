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
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Coluna 1 — Institucional */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white p-1">
                <Image
                  src="/logo.png"
                  alt=""
                  width={36}
                  height={36}
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="font-bold leading-tight">
                Ettore Sebastianini
                <span className="block text-xs font-normal text-white/70">
                  Instituto Social e Sustentável
                </span>
              </span>
            </div>

            <p className="text-sm leading-relaxed text-white/70">
              Transformando vidas através de iniciativas sociais e sustentáveis,
              promovendo o desenvolvimento humano e a inclusão social.
            </p>

            {/* Redes sociais */}
            <div className="flex items-center gap-3 mt-6">
              {redesSociais.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-base/10 flex items-center justify-center hover:bg-green transition-colors"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Coluna 2 — Links do site */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/60">
              Navegação
            </h3>
            <nav aria-label="Links do rodapé">
              <ul className="space-y-2">
                {linksSite.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/80 transition-colors hover:text-white"
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
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/60">
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
                (11) 99999-9999
              </a>
              <p className="flex items-start gap-2 text-sm text-white/80">
                <MapPin className="h-4 w-4 shrink-0 text-green mt-0.5" aria-hidden="true" />
                São Paulo, SP — Brasil
              </p>
            </address>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-6 text-xs text-white/60 sm:flex-row">
          <p>
            © {anoAtual} Instituto Ettore Sebastianini Social e Sustentável.
            Todos os direitos reservados.
          </p>
          <p>
            Desenvolvido com{" "}
            <span aria-label="amor" role="img">
              💚
            </span>{" "}
            para um mundo melhor.
          </p>
        </div>
      </div>
    </footer>
  );
}
