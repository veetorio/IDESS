import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/events/EventCard";
import { DonationSection } from "@/components/donations/DonationSection";
import {
  CalendarDays,
  Users,
  Leaf,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import type { Evento, PaginatedResponse, Projeto } from "@/types";

// ISR desabilitado pois cacheComponents está ativo no next.config.ts
// A busca de eventos recentes usa revalidate na própria chamada de fetch

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

const STATUS_PROJETO: Record<Projeto["status"], string> = {
  EM_ANDAMENTO: "Em andamento",
  AGENDADO: "Agendado",
  REALIZADO: "Realizado",
  SEM_EVENTOS: "Sem eventos associados",
};

async function buscarEventosRecentes(): Promise<Evento[]> {
  try {
    const res = await fetch(
      `${API_URL}/eventos?page=0&size=3&aberto=true`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data: PaginatedResponse<Evento> = await res.json();
    return data.content;
  } catch {
    return [];
  }
}

async function buscarProjetosDestaque(): Promise<{
  projetos: Projeto[];
  erro: string | null;
}> {
  try {
    const resposta = await fetch(`${API_URL}/projetos`, { cache: "no-store" });
    if (!resposta.ok) {
      return {
        projetos: [],
        erro: "Não foi possível carregar os projetos. Tente novamente mais tarde.",
      };
    }

    const projetos: Projeto[] = await resposta.json();
    return { projetos: projetos.slice(0, 3), erro: null };
  } catch {
    return {
      projetos: [],
      erro: "Não foi possível carregar os projetos. Tente novamente mais tarde.",
    };
  }
}

// =============================================
// Dados estáticos (serão vindos do CMS/backend futuramente)
// =============================================

const programas = [
  {
    icone: Leaf,
    titulo: "Sustentabilidade Urbana",
    descricao:
      "Projetos de revitalização de espaços públicos e educação ambiental para comunidades.",
  },
  {
    icone: Users,
    titulo: "Inclusão Social",
    descricao:
      "Programas de capacitação profissional e apoio a famílias em situação de vulnerabilidade.",
  },
  {
    icone: CalendarDays,
    titulo: "Eventos Culturais",
    descricao:
      "Promoção de cultura, arte e esporte como ferramentas de transformação social.",
  },
];

const fundadores = [
  { nome: "Ettore Sebastianini", cargo: "Fundador & Presidente" },
  { nome: "Nome Fundador 2", cargo: "Co-fundador" },
  { nome: "Nome Fundador 3", cargo: "Diretor Executivo" },
];

const patrocinadores = [
  { nome: "Patrocinador 1" },
  { nome: "Patrocinador 2" },
  { nome: "Patrocinador 3" },
  { nome: "Patrocinador 4" },
  { nome: "Patrocinador 5" },
];

// =============================================
// Página
// =============================================

export default async function HomePage() {
  const [eventosRecentes, resultadoProjetos] = await Promise.all([
    buscarEventosRecentes(),
    buscarProjetosDestaque(),
  ]);
  const { projetos, erro: erroProjetos } = resultadoProjetos;

  return (
    <>
      {/* ===== Apresentação ===== */}
      <section
        id="inicio"
        className="overflow-hidden bg-base px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-green-dark">
              <span className="h-px w-8 bg-green" aria-hidden="true" />
              Instituto de Desenvolvimento Social Sustentável
            </p>
            <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.04] tracking-tight text-primary sm:text-5xl lg:text-7xl">
              Transformando vidas,{" "}
              <span className="text-green-dark">construindo futuro.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8">
              Promovemos iniciativas sociais e sustentáveis para o
              desenvolvimento humano e a inclusão social em nossas comunidades.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="success" size="lg" asChild>
                <Link href="/eventos">
                  <CalendarDays className="h-5 w-5" aria-hidden="true" />
                  Ver eventos
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#sobre">Conheça o Instituto</Link>
              </Button>
            </div>
            <p className="mt-8 border-l-2 border-green pl-4 text-sm leading-6 text-neutral-600">
              Ações sociais, cultura e sustentabilidade construídas junto com
              as comunidades.
            </p>
          </div>

          <figure className="relative mx-auto w-full max-w-2xl lg:mr-0">
            <div className="relative z-10 aspect-[4/3] overflow-hidden bg-primary/10">
              <Image
                src="/fotos/back(1).jpeg"
                alt="Participantes de uma iniciativa comunitária do Instituto"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            </div>
            <figcaption className="relative z-10 mt-3 flex items-start justify-between gap-4 border-t border-primary/20 pt-3 text-xs font-medium uppercase tracking-wide text-neutral-600">
              <span>Presença e desenvolvimento comunitário</span>
              <span className="shrink-0 text-primary">São Luís · MA</span>
            </figcaption>
            <div
              className="absolute -bottom-3 -left-3 z-0 h-24 w-24 bg-green/20 sm:-bottom-5 sm:-left-5 sm:h-32 sm:w-32"
              aria-hidden="true"
            />
          </figure>
        </div>
      </section>

      {/* ===== Sobre ===== */}
      <section
        id="sobre"
        className="bg-white px-5 py-16 sm:px-8 sm:py-20"
        aria-labelledby="sobre-titulo"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-green-dark">
                Quem somos
              </span>
              <h2
                id="sobre-titulo"
                className="mt-2 text-3xl md:text-4xl font-bold text-primary"
              >
                Sobre o Instituto
              </h2>
              <p className="mt-4 text-neutral-700 leading-relaxed">
                Fundado com o propósito de gerar impacto positivo, o Instituto
                Ettore Sebastianini atua na promoção da dignidade humana,
                sustentabilidade ambiental e desenvolvimento comunitário.
              </p>
              <p className="mt-4 text-neutral-700 leading-relaxed">
                Por meio de programas educativos, eventos culturais e parcerias
                estratégicas, conectamos pessoas, organizações e recursos para
                construir comunidades mais justas e resilientes.
              </p>
              <Button variant="default" className="mt-8" asChild>
                <Link href="#fundadores">
                  Conheça os fundadores
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-primary/10 shadow-xl">
              <Image
                src="/fotos/WhatsApp Image 2026-10-20 at 19.57.47 (1).jpeg"
                alt="Ação comunitária com participantes e voluntários"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Fundadores ===== */}
      <section
        id="fundadores"
        className="bg-base px-5 py-16 sm:px-8 sm:py-20"
        aria-labelledby="fundadores-titulo"
      >
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-sm font-bold uppercase tracking-[0.16em] text-green-dark">
            As pessoas por trás do instituto
          </span>
          <h2
            id="fundadores-titulo"
            className="mt-2 text-3xl md:text-4xl font-bold text-primary"
          >
            Nossos Fundadores
          </h2>
          <p className="mt-4 text-neutral-600 max-w-xl mx-auto">
            Conheça as pessoas que dedicaram sua energia e visão para tornar
            este instituto uma realidade.
          </p>
          <div className="mt-12 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {fundadores.map((fundador) => (
              <div
                key={fundador.nome}
                className="border-t-2 border-primary/20 bg-white p-6 text-left transition-colors hover:border-green"
              >
                <div
                  className="mb-5 flex h-16 w-16 items-center justify-center bg-primary text-white"
                  aria-hidden="true"
                >
                  <span className="font-serif text-2xl">
                    {fundador.nome.charAt(0)}
                  </span>
                </div>
                <p className="font-semibold text-primary">{fundador.nome}</p>
                <p className="text-sm text-neutral-500 mt-1">{fundador.cargo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Programas ===== */}
      <section
        id="programas"
        className="bg-white px-5 py-16 sm:px-8 sm:py-20"
        aria-labelledby="programas-titulo"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-green-dark">
              Nossas iniciativas
            </span>
            <h2
              id="programas-titulo"
              className="mt-2 text-3xl md:text-4xl font-bold text-primary"
            >
              Nossos Programas
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {programas.map(({ icone: Icone, titulo, descricao }) => (
              <div
                key={titulo}
                className="border-t-2 border-primary/20 bg-base p-6 transition-colors hover:border-green"
              >
                <div className="mb-5 flex items-center gap-3 text-green-dark">
                  <Icone className="h-5 w-5" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-[0.14em]">
                    Iniciativa
                  </span>
                </div>
                <h3 className="font-semibold text-primary text-lg">{titulo}</h3>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                  {descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Projetos em Destaque ===== */}
      <section
        id="projetos"
        className="bg-base px-5 py-16 sm:px-8 sm:py-20"
        aria-labelledby="projetos-titulo"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.16em] text-green-dark">
                Nossas iniciativas
              </span>
              <h2
                id="projetos-titulo"
                className="mt-2 text-3xl font-bold text-primary md:text-4xl"
              >
                Projetos em Destaque
              </h2>
              <p className="mt-4 max-w-xl text-neutral-600">
                Conheça as iniciativas que promovem desenvolvimento e
                transformação social.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/projetos">
                Ver todos os projetos
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          {erroProjetos ? (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
            >
              {erroProjetos}
            </p>
          ) : projetos.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-neutral-300 p-12 text-center text-neutral-600">
              Nenhum projeto publicado no momento.
            </p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {projetos.map((projeto) => (
                <li
                  key={projeto.id}
                  className="min-w-0"
                >
                  <Link
                    href={`/projetos/${projeto.id}`}
                    className="group flex h-full flex-col overflow-hidden border border-neutral-200 bg-white transition-colors hover:border-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                      <Image
                        src={`${API_URL}${projeto.fotos[0] ?? projeto.logo}`}
                        alt={projeto.fotos[0] ? projeto.nome : `Logo ${projeto.nome}`}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                        className={
                          projeto.fotos[0]
                            ? "object-cover"
                            : "object-contain bg-white p-8"
                        }
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p
                        className={`text-xs font-semibold uppercase tracking-wide ${
                          projeto.status === "EM_ANDAMENTO"
                            ? "text-green-dark"
                            : "text-neutral-500"
                        }`}
                      >
                        {STATUS_PROJETO[projeto.status]}
                      </p>
                      <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight text-primary">
                        {projeto.nome}
                      </h3>
                      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-neutral-700">
                        {projeto.descricao}
                      </p>
                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-neutral-200 pt-4">
                        <span className="inline-flex items-center gap-2 text-sm text-neutral-600">
                          <Users
                            className="h-4 w-4 shrink-0 text-green"
                            aria-hidden="true"
                          />
                          {projeto.participantes} participantes
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                          Conheça
                          <ArrowRight
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ===== Doações ===== */}
      <DonationSection />

      {/* ===== Eventos Recentes ===== */}
      <section
        id="eventos"
        className="bg-white px-5 py-16 sm:px-8 sm:py-20"
        aria-labelledby="eventos-titulo"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.16em] text-green-dark">
                Fique por dentro
              </span>
              <h2
                id="eventos-titulo"
                className="mt-2 text-3xl md:text-4xl font-bold text-primary"
              >
                Eventos Recentes
              </h2>
            </div>
            <Button variant="outline" asChild>
              <Link href="/eventos">
                Ver todos
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          {eventosRecentes.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {eventosRecentes.map((evento) => (
                <EventCard key={evento.id} evento={evento} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-500">
              <CalendarDays
                className="h-10 w-10 mx-auto mb-3 text-neutral-300"
                aria-hidden="true"
              />
              <p>Nenhum evento aberto no momento.</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/eventos">Ver todos os eventos</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ===== Patrocinadores ===== */}
      <section
        id="patrocinadores"
        className="bg-base px-5 py-16 sm:px-8 sm:py-20"
        aria-labelledby="patrocinadores-titulo"
      >
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-sm font-bold uppercase tracking-[0.16em] text-green-dark">
            Quem acredita em nós
          </span>
          <h2
            id="patrocinadores-titulo"
            className="mb-12 mt-3 font-serif text-3xl font-semibold text-primary md:text-4xl"
          >
            Nossos Patrocinadores
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {patrocinadores.map(({ nome }) => (
              <div
                key={nome}
                className="flex h-16 w-36 items-center justify-center border border-neutral-200 bg-white"
                aria-label={nome}
              >
                <span className="text-xs text-neutral-400 font-medium">
                  {nome}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Contato ===== */}
      <section
        id="contato"
        className="bg-primary px-5 py-16 text-white sm:px-8 sm:py-20"
        aria-labelledby="contato-titulo"
      >
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-green-light font-semibold text-sm uppercase tracking-wider">
            Fale conosco
          </span>
          <h2
            id="contato-titulo"
            className="mt-3 font-serif text-3xl font-semibold text-white md:text-4xl"
          >
            Entre em Contato
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-white/80">
            Quer apoiar o instituto, se voluntariar ou saber mais sobre nossos
            programas? Adoraríamos conversar com você.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="success" size="lg" asChild>
              <a href="mailto:contato@institutoettore.org.br">
                <Mail aria-hidden="true" />
                Enviar e-mail
              </a>
            </Button>
            <Button variant="outline-white" size="lg" asChild>
              <a href="tel:+5511999999999">
                <Phone aria-hidden="true" />
                Ligar agora
              </a>
            </Button>
          </div>

          <address className="not-italic mt-8 flex flex-col justify-center gap-6 text-sm text-white/70 sm:flex-row">
            <span className="flex items-center gap-2 justify-center">
              <Mail className="h-4 w-4 text-green-light" aria-hidden="true" />
              contato@institutoettore.org.br
            </span>
            <span className="flex items-center gap-2 justify-center">
              <Phone className="h-4 w-4 text-green-light" aria-hidden="true" />
              (11) 99999-9999
            </span>
            <span className="flex items-center gap-2 justify-center">
              <MapPin className="h-4 w-4 text-green-light" aria-hidden="true" />
              São Paulo, SP
            </span>
          </address>
        </div>
      </section>
    </>
  );
}
