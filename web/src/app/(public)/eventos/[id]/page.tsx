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
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Voltar */}
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2 text-neutral-600">
          <Link href="/eventos">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Todos os eventos
          </Link>
        </Button>

        {/* Galeria */}
        {evento.imgs && evento.imgs.length > 0 && (
          <div className="mb-8">
            <EventGallery imagens={evento.imgs} nomeEvento={evento.nome} />
          </div>
        )}

        {/* Cabeçalho do evento */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={evento.aberto ? "success" : "secondary"} className="text-sm px-3 py-1">
              {evento.aberto ? "Inscrições abertas" : "Inscrições encerradas"}
            </Badge>
            {restantes === 0 && evento.aberto && (
              <Badge variant="destructive" className="text-sm px-3 py-1">
                Vagas esgotadas
              </Badge>
            )}
          </div>

          <h1 className="text-2xl md:text-4xl font-bold text-primary">
            {evento.nome}
          </h1>

          {/* Metadados */}
          <div className="flex flex-wrap gap-6 text-sm text-neutral-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green" aria-hidden="true" />
              <time dateTime={evento.criadoEm}>{formatarData(evento.criadoEm)}</time>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green" aria-hidden="true" />
              <span>
                {evento.vagasOcupadas}/{evento.vagasTotais} vagas •{" "}
                {restantes === 0 ? (
                  <span className="text-red-600 font-medium">Esgotado</span>
                ) : (
                  <span className="text-green font-medium">
                    {restantes} restante{restantes !== 1 ? "s" : ""}
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Barra de progresso de vagas */}
          <div
            className="h-2 rounded-full bg-neutral-200 overflow-hidden max-w-xs"
            role="progressbar"
            aria-valuenow={evento.vagasOcupadas}
            aria-valuemin={0}
            aria-valuemax={evento.vagasTotais}
            aria-label={`${porcentagem}% das vagas ocupadas`}
          >
            <div
              className={`h-full rounded-full ${
                porcentagem >= 90
                  ? "bg-red-500"
                  : porcentagem >= 60
                  ? "bg-yellow-500"
                  : "bg-green"
              }`}
              style={{ width: `${porcentagem}%` }}
            />
          </div>
        </div>

        {/* Divisor */}
        <hr className="border-neutral-200 mb-8" />

        {/* Descrição */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-primary mb-4">Sobre o evento</h2>
          <div className="prose prose-neutral max-w-none text-neutral-700 leading-relaxed whitespace-pre-line">
            {evento.descricao}
          </div>
        </div>

        {/* Botão de inscrição */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-primary mb-2">
            Participar deste evento
          </h2>
          <p className="text-sm text-neutral-600 mb-4">
            {evento.aberto && restantes > 0
              ? `Ainda há ${restantes} vaga${restantes !== 1 ? "s" : ""} disponível${restantes !== 1 ? "s" : ""}. Garanta a sua!`
              : evento.aberto
              ? "As vagas foram esgotadas."
              : "As inscrições para este evento estão encerradas."}
          </p>
          <EnrollButton
            eventoId={evento.id}
            aberto={evento.aberto}
            vagasOcupadas={evento.vagasOcupadas}
            vagasTotais={evento.vagasTotais}
          />
        </div>
      </div>
    </div>
  );
}
