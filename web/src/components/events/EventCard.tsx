import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatarData, vagasRestantes } from "@/lib/utils";
import type { Evento } from "@/types";

interface EventCardProps {
  evento: Evento;
}

export function EventCard({ evento }: EventCardProps) {
  const {
    id,
    nome,
    descricao,
    imgs,
    vagasOcupadas,
    vagasTotais,
    aberto,
    dataInicio,
  } = evento;

  const restantes = vagasRestantes(vagasOcupadas, vagasTotais);
  const semVagas = restantes === 0;
  const imagemPrincipal = imgs?.[0];

  return (
    <Card className="group overflow-hidden rounded-none border-x-0 border-t-0 transition-colors hover:border-green">
      {/* Imagem */}
      <Link
        href={`/eventos/${id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-primary/10"
        tabIndex={-1}
        aria-hidden="true"
      >
        {imagemPrincipal ? (
          <Image
            src={imagemPrincipal}
            alt={nome}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CalendarDays
              className="h-10 w-10 text-primary/20"
              aria-hidden="true"
            />
          </div>
        )}

        {/* Badge de status sobreposto à imagem */}
        <div className="absolute left-3 top-3">
          {!aberto || semVagas ? (
            <Badge variant="muted">
              {semVagas && aberto ? "Vagas esgotadas" : "Encerrado"}
            </Badge>
          ) : (
            <Badge variant="success">Inscrições abertas</Badge>
          )}
        </div>
      </Link>

      <CardContent className="px-0 py-5">
        {/* Título */}
        <Link href={`/eventos/${id}`}>
          <h3 className="line-clamp-2 font-serif text-2xl font-semibold leading-tight text-primary hover:underline">
            {nome}
          </h3>
        </Link>

        {/* Descrição resumida */}
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-700">
          {descricao}
        </p>

        {/* Metadados */}
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-neutral-600">
          <span className="flex items-center gap-1.5">
            <CalendarDays
              className="h-4 w-4 text-green shrink-0"
              aria-hidden="true"
            />
            {formatarData(`${dataInicio}T12:00:00`)}
          </span>
          <span className="flex items-center gap-1.5">
            <Users
              className="h-4 w-4 text-green shrink-0"
              aria-hidden="true"
            />
            <span>
              {vagasOcupadas}/{vagasTotais} vagas
              {restantes > 0 && (
                <span className="ml-1 text-green font-medium">
                  ({restantes} restantes)
                </span>
              )}
            </span>
          </span>
        </div>

        {/* Barra de progresso de vagas */}
        <div
          className="mt-3 h-1.5 overflow-hidden bg-neutral-100"
          role="progressbar"
          aria-valuenow={vagasOcupadas}
          aria-valuemin={0}
          aria-valuemax={vagasTotais}
          aria-label={`${vagasOcupadas} de ${vagasTotais} vagas ocupadas`}
        >
          <div
            className="h-full rounded-full bg-green transition-all"
            style={{
              width: `${Math.min(100, (vagasOcupadas / vagasTotais) * 100)}%`,
              backgroundColor: semVagas ? "#ef4444" : undefined,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
