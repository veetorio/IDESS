import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { formatarData } from "@/lib/utils";
import type { Projeto } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function buscarProjeto(id: string): Promise<Projeto | null> {
  const resposta = await fetch(`${API_URL}/projetos/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (resposta.status === 404) return null;
  if (!resposta.ok) throw new Error("Não foi possível carregar o projeto.");
  return resposta.json();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const projeto = await buscarProjeto(id);
  return projeto
    ? {
        title: projeto.nome,
        description: projeto.descricao.slice(0, 160),
        openGraph: {
          title: projeto.nome,
          description: projeto.descricao.slice(0, 160),
          images: projeto.fotos[0] ? [`${API_URL}${projeto.fotos[0]}`] : [],
          type: "article",
        },
      }
    : { title: "Projeto não encontrado" };
}

export default async function ProjetoDetalhePage({ params }: PageProps) {
  const { id } = await params;
  const projeto = await buscarProjeto(id);
  if (!projeto) notFound();

  const status = {
    EM_ANDAMENTO: "Em andamento",
    AGENDADO: "Agendado",
    REALIZADO: "Realizado",
    SEM_EVENTOS: "Sem eventos associados",
  }[projeto.status];

  return (
    <div className="min-h-screen bg-base">
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
          <Button variant="ghost" size="sm" asChild className="-ml-3 text-neutral-700">
            <Link href="/projetos">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Todos os projetos
            </Link>
          </Button>
        </div>
      </div>

      <article className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <header className="max-w-4xl border-b border-primary/15 py-10 sm:py-14">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={projeto.status === "EM_ANDAMENTO" ? "success" : "secondary"}>
              {status}
            </Badge>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-600">Projeto do Instituto</span>
          </div>

          <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight tracking-tight text-primary sm:text-5xl lg:text-6xl">
            {projeto.nome}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-neutral-700 sm:text-xl">
            {projeto.descricao.split(/\n+/)[0]}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-neutral-700">
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-green" aria-hidden="true" />
              {projeto.participantes} participantes
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-green" aria-hidden="true" />
              Criado em {formatarData(projeto.criadoEm)}
            </span>
            {projeto.ultimoEvento && (
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-green" aria-hidden="true" />
                {projeto.status === "AGENDADO" ? "Próximo evento" : "Evento associado"}
              </span>
            )}
          </div>

          <div className="mt-7 flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-neutral-200 bg-white">
              <Image
                src={`${API_URL}${projeto.logo}`}
                alt=""
                fill
                unoptimized
                className="object-contain p-1"
              />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-neutral-800">Instituto Ettore Sebastianini</p>
              <p className="text-neutral-500">Iniciativa de impacto social</p>
            </div>
          </div>
        </header>

        {projeto.fotos[0] && (
          <figure className="mx-auto max-w-5xl">
            <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
              <Image
                src={`${API_URL}${projeto.fotos[0]}`}
                alt={`${projeto.nome} — imagem de destaque`}
                fill
                unoptimized
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-center text-xs text-neutral-500">
              Uma iniciativa do Instituto Ettore Sebastianini
            </figcaption>
          </figure>
        )}

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0">
            <section aria-labelledby="sobre-projeto-titulo">
              <h2 id="sobre-projeto-titulo" className="font-serif text-3xl font-semibold text-primary">
                Sobre o projeto
              </h2>
              <div className="mt-5 max-w-3xl space-y-5 text-base leading-7 text-neutral-700">
                {projeto.descricao.split(/\n+/).filter(Boolean).map((paragrafo, indice) => (
                  <p key={`${indice}-${paragrafo.slice(0, 24)}`}>{paragrafo}</p>
                ))}
              </div>
            </section>

            <section className="mt-12 border-t border-neutral-300 pt-8" aria-labelledby="galeria-titulo">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-green">
                    Registros
                  </span>
                  <h2 id="galeria-titulo" className="mt-1 font-serif text-3xl font-semibold text-primary">
                    Momentos do projeto
                  </h2>
                </div>
                <span className="shrink-0 text-sm text-neutral-500">
                  {projeto.fotos.length} fotos
                </span>
              </div>
              <ProjectGallery
                fotos={projeto.fotos.slice(1)}
                nomeProjeto={projeto.nome}
                apiUrl={API_URL}
              />
            </section>
          </div>

          <aside className="space-y-5">
            <section className="border-t-2 border-primary bg-white p-5" aria-labelledby="dados-projeto-titulo">
              <h2 id="dados-projeto-titulo" className="font-serif text-xl font-semibold text-primary">
                Em números
              </h2>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center bg-green/10 text-green-dark">
                  <Users className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xl font-bold text-primary">{projeto.participantes}</p>
                  <p className="text-xs text-neutral-600">participantes</p>
                </div>
              </div>
              <div className="mt-4 border-t border-neutral-200 pt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Situação atual
                </p>
                <p className="mt-1 font-semibold text-neutral-800">{status}</p>
              </div>
            </section>

            <section className="border-t border-neutral-300 bg-white p-5" aria-labelledby="evento-recente-titulo">
              <h2 id="evento-recente-titulo" className="font-serif text-xl font-semibold text-primary">
                {projeto.status === "AGENDADO" ? "Próximo evento" : "Evento associado mais recente"}
              </h2>
              {projeto.ultimoEvento ? (
                <>
                  <p className="mt-3 font-semibold leading-snug text-neutral-800">
                    {projeto.ultimoEvento.nome}
                  </p>
                  <p className="mt-2 text-sm text-neutral-600">
                    {formatarData(`${projeto.ultimoEvento.dataInicio}T12:00:00`)}
                    {projeto.ultimoEvento.dataFim !== projeto.ultimoEvento.dataInicio
                      ? ` — ${formatarData(`${projeto.ultimoEvento.dataFim}T12:00:00`)}`
                      : ""}
                  </p>
                  <Link
                    href={`/eventos/${projeto.ultimoEvento.id}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    Ver evento
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </>
              ) : (
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  Este projeto ainda não possui eventos associados.
                </p>
              )}
            </section>
          </aside>
        </div>
      </article>
    </div>
  );
}
