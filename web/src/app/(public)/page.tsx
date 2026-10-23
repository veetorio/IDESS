import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/events/EventCard";
import {
  CalendarDays,
  Users,
  Leaf,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import type { Evento, PaginatedResponse } from "@/types";

// ISR desabilitado pois cacheComponents está ativo no next.config.ts
// A busca de eventos recentes usa revalidate na própria chamada de fetch

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

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

const imagensDestaque = [
  "/fotos/back(1).jpeg",
  "/fotos/WhatsApp Image 2026-10-20 at 19.57.47 (1).jpeg",
  "/fotos/WhatsApp Image 2026-10-20 at 19.57.47.jpeg",
];

// =============================================
// Página
// =============================================

export default async function HomePage() {
  const eventosRecentes = await buscarEventosRecentes();

  return (
    <>
      {/* ===== Hero ===== */}
      <section
        id="inicio"
        className="relative isolate flex min-h-[90vh] items-center justify-center overflow-hidden bg-primary px-6 py-20"
      >
        <div className="absolute inset-0" aria-hidden="true">
          {imagensDestaque.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className="hero-slide object-cover object-[50%_45%]"
              style={{
                animationDelay: `${index * 4}s`,
                animationDuration: "12s",
              }}
            />
          ))}
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-t from-primary/80 via-black/35 to-black/30"
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-3xl text-center">
          <span className="mb-6 inline-block rounded-full bg-green/20 px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-green-light">
            ETTORE SEBASTIANINI INSTITUTO DE DESENVOLVIMENTO SOCIAL SUSTENTÁVEL
          </span>
          <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">
            Transformando vidas,{" "}
            <span className="text-green-light">construindo futuro</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">
            O ETTORE SEBASTIANINI INSTITUTO DE DESENVOLVIMENTO SOCIAL SUSTENTÁVEL promove iniciativas sociais e
            sustentáveis para o desenvolvimento humano e a inclusão social em
            nossas comunidades.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="success" size="lg" asChild>
              <Link href="/eventos">
                <CalendarDays className="h-5 w-5" aria-hidden="true" />
                Ver eventos
              </Link>
            </Button>
            <Button variant="outline-white" size="lg" asChild>
              <Link href="#contato">Entre em contato</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ===== Sobre ===== */}
      <section
        id="sobre"
        className="py-20 px-6 bg-base"
        aria-labelledby="sobre-titulo"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-green font-semibold text-sm uppercase tracking-wider">
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
        className="py-20 px-6 bg-neutral-50"
        aria-labelledby="fundadores-titulo"
      >
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-green font-semibold text-sm uppercase tracking-wider">
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
                className="rounded-xl bg-white border border-neutral-200 p-6 text-center"
              >
                <div
                  className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="text-primary/40 text-2xl font-bold">
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
        className="py-20 px-6 bg-base"
        aria-labelledby="programas-titulo"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-green font-semibold text-sm uppercase tracking-wider">
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
                className="rounded-xl bg-white border border-neutral-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-green/10 flex items-center justify-center mb-4">
                  <Icone className="h-6 w-6 text-green" aria-hidden="true" />
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

      {/* ===== Eventos Recentes ===== */}
      <section
        id="eventos"
        className="py-20 px-6 bg-neutral-50"
        aria-labelledby="eventos-titulo"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-green font-semibold text-sm uppercase tracking-wider">
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
        className="py-20 px-6 bg-base"
        aria-labelledby="patrocinadores-titulo"
      >
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-green font-semibold text-sm uppercase tracking-wider">
            Quem acredita em nós
          </span>
          <h2
            id="patrocinadores-titulo"
            className="mt-2 text-3xl md:text-4xl font-bold text-primary mb-12"
          >
            Nossos Patrocinadores
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {patrocinadores.map(({ nome }) => (
              <div
                key={nome}
                className="w-36 h-16 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center"
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
        className="py-20 px-6 bg-primary"
        aria-labelledby="contato-titulo"
      >
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-green-light font-semibold text-sm uppercase tracking-wider">
            Fale conosco
          </span>
          <h2
            id="contato-titulo"
            className="mt-2 text-3xl md:text-4xl font-bold text-white"
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
