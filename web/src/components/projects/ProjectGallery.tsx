"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectGalleryProps {
  fotos: string[];
  nomeProjeto: string;
  apiUrl: string;
}

export function ProjectGallery({
  fotos,
  nomeProjeto,
  apiUrl,
}: ProjectGalleryProps) {
  const [indiceAtivo, setIndiceAtivo] = useState<number | null>(null);

  if (fotos.length === 0) return null;

  function anterior() {
    setIndiceAtivo((indice) =>
      indice === null ? null : (indice - 1 + fotos.length) % fotos.length
    );
  }

  function proxima() {
    setIndiceAtivo((indice) =>
      indice === null ? null : (indice + 1) % fotos.length
    );
  }

  function tratarTecla(evento: React.KeyboardEvent<HTMLDivElement>) {
    if (evento.key === "Escape") setIndiceAtivo(null);
    if (evento.key === "ArrowLeft") anterior();
    if (evento.key === "ArrowRight") proxima();
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {fotos.map((foto, indice) => (
          <button
            key={`${foto}-${indice}`}
            type="button"
            onClick={() => setIndiceAtivo(indice)}
            aria-label={`Ampliar foto ${indice + 1} de ${fotos.length} do projeto ${nomeProjeto}`}
            className={`group relative overflow-hidden bg-neutral-100 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              indice === 0
                ? "col-span-2 aspect-[16/8]"
                : indice === 1 && fotos.length > 3
                  ? "row-span-2 aspect-[3/4]"
                  : "aspect-[4/3]"
            }`}
          >
            <Image
              src={`${apiUrl}${foto}`}
              alt={`${nomeProjeto} — foto ${indice + 1}`}
              fill
              unoptimized
              sizes={indice === 0 ? "(max-width: 768px) 100vw, 900px" : "(max-width: 768px) 50vw, 450px"}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <span className="absolute bottom-3 left-3 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
              Ver foto {indice + 1}
            </span>
          </button>
        ))}
      </div>

      {indiceAtivo !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Galeria de fotos do projeto ${nomeProjeto}`}
          onKeyDown={tratarTecla}
          tabIndex={-1}
          ref={(elemento) => elemento?.focus()}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIndiceAtivo(null)}
            aria-label="Fechar galeria"
            className="absolute right-4 top-4 z-10 text-white hover:bg-white/10"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </Button>

          {fotos.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={anterior}
              aria-label="Foto anterior"
              className="absolute left-2 z-10 rounded-full text-white hover:bg-white/10 sm:left-6"
            >
              <ChevronLeft className="h-8 w-8" aria-hidden="true" />
            </Button>
          )}

          <div className="relative h-full max-h-[85vh] w-full max-w-6xl">
            <Image
              src={`${apiUrl}${fotos[indiceAtivo]}`}
              alt={`${nomeProjeto} — foto ${indiceAtivo + 1}`}
              fill
              unoptimized
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {fotos.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={proxima}
              aria-label="Próxima foto"
              className="absolute right-2 z-10 rounded-full text-white hover:bg-white/10 sm:right-6"
            >
              <ChevronRight className="h-8 w-8" aria-hidden="true" />
            </Button>
          )}

          <p className="absolute bottom-4 text-sm text-white/75" aria-live="polite">
            {indiceAtivo + 1} / {fotos.length}
          </p>
        </div>
      )}
    </>
  );
}
