"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EventGalleryProps {
  imagens: string[];
  nomeEvento: string;
}

export function EventGallery({ imagens, nomeEvento }: EventGalleryProps) {
  const [indiceAtivo, setIndiceAtivo] = useState(0);
  const [lightboxAberto, setLightboxAberto] = useState(false);

  if (imagens.length === 0) return null;

  function anterior() {
    setIndiceAtivo((i) => (i === 0 ? imagens.length - 1 : i - 1));
  }

  function proximo() {
    setIndiceAtivo((i) => (i === imagens.length - 1 ? 0 : i + 1));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") anterior();
    if (e.key === "ArrowRight") proximo();
    if (e.key === "Escape") setLightboxAberto(false);
  }

  return (
    <>
      {/* Imagem principal */}
      <div className="space-y-3">
        <div
          className="relative aspect-video rounded-xl overflow-hidden bg-primary/10 cursor-pointer"
          onClick={() => setLightboxAberto(true)}
          role="button"
          tabIndex={0}
          aria-label={`Ampliar imagem ${indiceAtivo + 1} de ${imagens.length} do evento ${nomeEvento}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setLightboxAberto(true);
          }}
        >
          <Image
            src={imagens[indiceAtivo]}
            alt={`Imagem ${indiceAtivo + 1} do evento ${nomeEvento}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 720px"
            priority={indiceAtivo === 0}
          />

          {/* Controles de navegação (apenas se tiver mais de 1 imagem) */}
          {imagens.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  anterior();
                }}
                aria-label="Imagem anterior"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white hover:bg-black/60 rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  proximo();
                }}
                aria-label="Próxima imagem"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white hover:bg-black/60 rounded-full"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>

              {/* Indicador de posição */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {imagens.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIndiceAtivo(i);
                    }}
                    aria-label={`Ir para imagem ${i + 1}`}
                    aria-current={i === indiceAtivo}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all",
                      i === indiceAtivo
                        ? "bg-white w-4"
                        : "bg-white/50 hover:bg-white/80"
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Miniaturas (apenas se houver mais de 1 imagem) */}
        {imagens.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {imagens.map((img, i) => (
              <button
                key={i}
                onClick={() => setIndiceAtivo(i)}
                aria-label={`Selecionar imagem ${i + 1}`}
                aria-current={i === indiceAtivo}
                className={cn(
                  "relative w-16 h-12 shrink-0 rounded-md overflow-hidden border-2 transition-all",
                  i === indiceAtivo
                    ? "border-primary"
                    : "border-transparent hover:border-primary/40"
                )}
              >
                <Image
                  src={img}
                  alt={`Miniatura ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxAberto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Galeria ampliada"
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLightboxAberto(false)}
            aria-label="Fechar galeria"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="relative w-full max-w-4xl aspect-video">
            <Image
              src={imagens[indiceAtivo]}
              alt={`Imagem ${indiceAtivo + 1} do evento ${nomeEvento}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {imagens.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={anterior}
                aria-label="Imagem anterior"
                className="absolute left-4 text-white hover:bg-white/10"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={proximo}
                aria-label="Próxima imagem"
                className="absolute right-4 text-white hover:bg-white/10"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          <p className="absolute bottom-4 text-white/60 text-sm">
            {indiceAtivo + 1} / {imagens.length}
          </p>
        </div>
      )}
    </>
  );
}
