import type { Metadata } from "next";
import { EventGrid } from "@/components/events/EventGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { PaginatedResponse, Evento } from "@/types";

export const metadata: Metadata = {
  title: "Eventos",
  description: "Confira todos os eventos do Instituto Ettore Sebastianini e faça sua inscrição.",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

interface PageProps {
  searchParams: Promise<{ aberto?: string; pagina?: string }>;
}

async function buscarEventos(
  aberto?: string,
  pagina = 0
): Promise<PaginatedResponse<Evento>> {
  const params = new URLSearchParams({ page: String(pagina), size: "9" });
  if (aberto === "true" || aberto === "false") {
    params.set("aberto", aberto);
  }

  const res = await fetch(`${API_URL}/eventos?${params.toString()}`, {
    // SSR — sem cache para dados sempre atualizados
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Falha ao carregar eventos.");
  }

  return res.json();
}

export default async function PaginaEventos({ searchParams }: PageProps) {
  const { aberto, pagina: paginaParam } = await searchParams;
  const pagina = Number(paginaParam ?? 0);

  let dados: PaginatedResponse<Evento>;
  let erroBusca: string | null = null;

  try {
    dados = await buscarEventos(aberto, pagina);
  } catch (err) {
    erroBusca =
      err instanceof Error ? err.message : "Erro ao carregar eventos.";
    dados = { content: [], totalElements: 0, totalPages: 0, number: 0, size: 9 };
  }

  return (
    <div className="min-h-screen bg-base">
      {/* Cabeçalho da página */}
      <div className="bg-primary px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <span className="text-green-light font-semibold text-sm uppercase tracking-wider">
            Participe
          </span>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold text-white">
            Nossos Eventos
          </h1>
          <p className="mt-4 max-w-xl text-white/80">
            Inscreva-se nos nossos eventos e faça parte das iniciativas sociais
            e sustentáveis do Instituto Ettore Sebastianini.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-8" role="group" aria-label="Filtrar eventos">
          <Link href="/eventos">
            <Badge
              variant={!aberto ? "primary" : "outline"}
              className="cursor-pointer px-4 py-1.5 text-sm"
            >
              Todos
            </Badge>
          </Link>
          <Link href="/eventos?aberto=true">
            <Badge
              variant={aberto === "true" ? "success" : "outline"}
              className="cursor-pointer px-4 py-1.5 text-sm"
            >
              Abertos
            </Badge>
          </Link>
          <Link href="/eventos?aberto=false">
            <Badge
              variant={aberto === "false" ? "secondary" : "outline"}
              className="cursor-pointer px-4 py-1.5 text-sm"
            >
              Encerrados
            </Badge>
          </Link>
        </div>

        {/* Resultados */}
        {erroBusca ? (
          <div
            role="alert"
            className="text-center py-16 text-neutral-500"
          >
            <p className="text-lg font-medium text-red-600">Erro ao carregar eventos</p>
            <p className="text-sm mt-1">{erroBusca}</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-neutral-500 mb-6">
              {dados.totalElements}{" "}
              {dados.totalElements === 1 ? "evento encontrado" : "eventos encontrados"}
            </p>

            <EventGrid eventos={dados.content} />

            {/* Paginação */}
            {dados.totalPages > 1 && (
              <nav
                className="flex justify-center gap-2 mt-12"
                aria-label="Paginação de eventos"
              >
                {pagina > 0 && (
                  <Button variant="outline" asChild>
                    <Link
                      href={`/eventos?${aberto ? `aberto=${aberto}&` : ""}pagina=${pagina - 1}`}
                    >
                      Anterior
                    </Link>
                  </Button>
                )}
                <span className="flex items-center px-4 text-sm text-neutral-600">
                  Página {pagina + 1} de {dados.totalPages}
                </span>
                {pagina < dados.totalPages - 1 && (
                  <Button variant="outline" asChild>
                    <Link
                      href={`/eventos?${aberto ? `aberto=${aberto}&` : ""}pagina=${pagina + 1}`}
                    >
                      Próxima
                    </Link>
                  </Button>
                )}
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}
