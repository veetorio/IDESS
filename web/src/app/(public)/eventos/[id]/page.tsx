import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EventGallery } from "@/components/events/EventGallery";
import { EnrollButton } from "@/components/events/EnrollButton";
import { formatarData, vagasRestantes } from "@/lib/utils";
import type { Evento } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function buscarEvento(id: string): Promise<Evento | null> {
  try {
    const res = await fetch(`${API_URL}/eventos/${id}`, {
      cache: "no-store",
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Falha ao carregar evento.");
    return res.json();
  } catch {
    return null;
  }
}

// Metadata dinâmica com o nome do evento
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const evento = await buscarEvento(id);

  if (!evento) {
    return { title: "Evento não encontrado" };
  }

  return {
    title: evento.nome,
    description: evento.descricao.substring(0, 160),
    openGraph: {
      title: evento.nome,
      description: evento.descricao.substring(0, 160),
      images: evento.imgs?.[0] ? [evento.imgs[0]] : [],
    },
  };
}

export default async function PaginaDetalheEvento({ params }: PageProps) {
  const { id } = await params;
  const evento = await buscarEvento(id);

  if (!evento) notFound();

  const restantes = vagasRestantes(evento.vagasOcupadas, evento.vagasTotais);
  const porcentagem = Math.round((evento.vagasOcupadas / evento.vagasTotais) * 100);

  return (
    <div className="min-h-screen bg-base">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <Button variant="ghost" size="sm" asChild className="-ml-3 text-neutral-700">
          <Link href="/eventos">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Todos os eventos
          </Link>
        </Button>

        <header className="border-b border-primary/15 py-8 sm:py-10">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={evento.aberto ? "success" : "secondary"}>
              {evento.aberto ? "Inscrições abertas" : "Inscrições encerradas"}
            </Badge>
            {restantes === 0 && evento.aberto && (
              <Badge variant="destructive">Vagas esgotadas</Badge>
            )}
          </div>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight text-primary sm:text-5xl lg:text-6xl">
            {evento.nome}
          </h1>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-neutral-700">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-dark" aria-hidden="true" />
              <time dateTime={evento.dataInicio}>
                {formatarData(`${evento.dataInicio}T12:00:00`)}
                {evento.dataFim !== evento.dataInicio
                  ? ` a ${formatarData(`${evento.dataFim}T12:00:00`)}`
                  : ""}
              </time>
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="text-green-dark" aria-hidden="true">·</span>
              <span>
                {evento.projetoId ? (
                  <>
                    Projeto:{" "}
                    <Link href={`/projetos/${evento.projetoId}`} className="font-semibold text-primary underline underline-offset-4">
                      {evento.projetoNome}
                    </Link>
                  </>
                ) : (
                  evento.projetoNome || "Evento do Instituto"
                )}
              </span>
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-green-dark" aria-hidden="true" />
              {evento.vagasOcupadas}/{evento.vagasTotais} vagas
              <span className={restantes === 0 ? "font-semibold text-red-700" : "font-semibold text-green-dark"}>
                {restantes === 0
                  ? "Esgotado"
                  : `${restantes} restante${restantes !== 1 ? "s" : ""}`}
              </span>
            </span>
          </div>
        </header>

        <div className="grid gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-14 lg:py-10">
          <article className="min-w-0">
            {evento.imgs && evento.imgs.length > 0 && (
              <div className="mb-10">
                <EventGallery imagens={evento.imgs} nomeEvento={evento.nome} />
              </div>
            )}
            <section aria-labelledby="sobre-evento-titulo">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-dark">
                Sobre
              </p>
              <h2 id="sobre-evento-titulo" className="mt-2 font-serif text-3xl font-semibold text-primary">
                O encontro
              </h2>
              <div className="prose prose-neutral mt-5 max-w-none whitespace-pre-line text-base leading-7 text-neutral-700">
                {evento.descricao}
              </div>
            </section>
          </article>

          <aside className="h-fit border-t-2 border-primary bg-white p-5 sm:p-6 lg:sticky lg:top-24" aria-labelledby="participar-evento-titulo">
            <h2 id="participar-evento-titulo" className="font-serif text-2xl font-semibold text-primary">
              Participe
            </h2>
            <p className="mt-3 text-sm leading-6 text-neutral-700">
              {evento.aberto && restantes > 0
                ? `Ainda há ${restantes} vaga${restantes !== 1 ? "s" : ""} disponível${restantes !== 1 ? "s" : ""}.`
                : evento.aberto
                ? "As vagas foram esgotadas."
                : "As inscrições para este evento estão encerradas."}
            </p>
            <div
              className="mt-5 h-2 overflow-hidden bg-neutral-200"
              role="progressbar"
              aria-valuenow={evento.vagasOcupadas}
              aria-valuemin={0}
              aria-valuemax={evento.vagasTotais}
              aria-label={`${porcentagem}% das vagas ocupadas`}
            >
              <div
                className={`h-full ${
                  porcentagem >= 90
                    ? "bg-red-700"
                    : porcentagem >= 60
                    ? "bg-amber-600"
                    : "bg-green"
                }`}
                style={{ width: `${porcentagem}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-neutral-600">
              {evento.vagasOcupadas} de {evento.vagasTotais} vagas preenchidas
            </p>
            <EnrollButton
              eventoId={evento.id}
              aberto={evento.aberto}
              vagasOcupadas={evento.vagasOcupadas}
              vagasTotais={evento.vagasTotais}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
