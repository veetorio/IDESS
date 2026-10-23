import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, Plus, Users } from "lucide-react";
import { EventForm } from "@/components/admin/EventForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usuarioDoToken, tokenExpirado } from "@/lib/auth";
import { formatarData } from "@/lib/utils";
import type { Evento, PaginatedResponse } from "@/types";

export const metadata: Metadata = {
  title: "Administração de eventos",
  description: "Crie e acompanhe os eventos do ETTORE SEBASTIANINI INSTITUTO DE DESENVOLVIMENTO SOCIAL SUSTENTÁVEL.",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function buscarEventos(): Promise<PaginatedResponse<Evento>> {
  const resposta = await fetch(`${API_URL}/eventos?page=0&size=100`, {
    cache: "no-store",
  });

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar os eventos.");
  }

  return resposta.json();
}

export default async function AdministrarEventosPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const usuario = token ? usuarioDoToken(token) : null;

  if (!token || tokenExpirado(token)) {
    redirect("/entrar?redirect=/admin/eventos");
  }

  if (usuario?.role !== "ADMIN") {
    redirect("/");
  }

  let eventos: Evento[] = [];
  let erroBusca: string | null = null;

  try {
    const dados = await buscarEventos();
    eventos = dados.content;
  } catch (erro) {
    erroBusca =
      erro instanceof Error ? erro.message : "Erro ao carregar os eventos.";
  }

  return (
    <div className="min-h-screen bg-base">
      <section className="bg-primary px-6 py-12 text-white sm:py-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="success">Administração</Badge>
            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
              Eventos do instituto
            </h1>
            <p className="mt-3 max-w-2xl text-white/80">
              Crie eventos e acompanhe as vagas e o status das inscrições.
            </p>
          </div>
          <Button variant="outline-white" asChild>
            <Link href="/eventos">Ver página pública</Link>
          </Button>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section
          className="h-fit rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
          aria-labelledby="criar-evento-titulo"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green/10 text-green">
              <Plus className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2
                id="criar-evento-titulo"
                className="text-xl font-semibold text-primary"
              >
                Criar evento
              </h2>
              <p className="text-sm text-neutral-600">
                Preencha os dados para publicar um evento.
              </p>
            </div>
          </div>
          <EventForm />
        </section>

        <section aria-labelledby="eventos-cadastrados-titulo">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <h2
                id="eventos-cadastrados-titulo"
                className="text-xl font-semibold text-primary"
              >
                Eventos cadastrados
              </h2>
              <p className="mt-1 text-sm text-neutral-600">
                {eventos.length} {eventos.length === 1 ? "evento" : "eventos"}
              </p>
            </div>
          </div>

          {erroBusca ? (
            <p
              className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              role="alert"
            >
              {erroBusca}
            </p>
          ) : eventos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/70 px-6 py-12 text-center">
              <CalendarDays
                className="mx-auto h-10 w-10 text-neutral-300"
                aria-hidden="true"
              />
              <p className="mt-3 font-medium text-neutral-700">
                Nenhum evento cadastrado ainda.
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                Use o formulário para criar o primeiro.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {eventos.map((evento) => (
                <li key={evento.id}>
                  <Card className="border-neutral-200 bg-white">
                    <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <Badge
                            variant={evento.aberto ? "success" : "secondary"}
                          >
                            {evento.aberto ? "Inscrições abertas" : "Encerrado"}
                          </Badge>
                          <span className="text-xs text-neutral-500">
                            {formatarData(evento.criadoEm)}
                          </span>
                        </div>
                        <h3 className="truncate font-semibold text-primary">
                          {evento.nome}
                        </h3>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-600">
                          <Users
                            className="h-4 w-4 text-green"
                            aria-hidden="true"
                          />
                          {evento.vagasOcupadas}/{evento.vagasTotais} vagas
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/eventos/${evento.id}`}>Ver evento</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
