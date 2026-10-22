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
    criadoEm,
  } = evento;

  const restantes = vagasRestantes(vagasOcupadas, vagasTotais);
  const semVagas = restantes === 0;
  const imagemPrincipal = imgs?.[0];

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow group">
      {/* Imagem */}
      <Link
        href={`/eventos/${id}`}
        className="block aspect-video relative bg-primary/10 overflow-hidden"
        tabIndex={-1}
        aria-hidden="true"
      >
        {imagemPrincipal ? (
          <Image
            src={imagemPrincipal}
            alt={nome}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
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
        <div className="absolute top-3 left-3">
          {!aberto || semVagas ? (
            <Badge variant="muted">
              {semVagas && aberto ? "Vagas esgotadas" : "Encerrado"}
            </Badge>
          ) : (
            <Badge variant="success">Inscrições abertas</Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        {/* Título */}
        <Link href={`/eventos/${id}`}>
          <h3 className="font-semibold text-primary text-lg leading-tight hover:underline line-clamp-2">
            {nome}
          </h3>
        </Link>

        {/* Descrição resumida */}
        <p className="mt-1.5 text-sm text-neutral-600 line-clamp-2">
          {descricao}
        </p>

        {/* Metadados */}
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-neutral-500">
          <span className="flex items-center gap-1.5">
            <CalendarDays
              className="h-4 w-4 text-green shrink-0"
              aria-hidden="true"
            />
            {formatarData(criadoEm)}
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
          className="mt-3 h-1.5 rounded-full bg-neutral-100 overflow-hidden"
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
