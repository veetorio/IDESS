"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import type { Evento, PaginatedResponse } from "@/types";

interface UseEventsOptions {
  aberto?: boolean; // filtro por status
  pagina?: number;
  tamanho?: number;
}

interface UseEventsResult {
  eventos: Evento[];
  total: number;
  totalPaginas: number;
  carregando: boolean;
  erro: string | null;
  recarregar: () => void;
}

/**
 * Hook para busca de eventos com filtro e paginação.
 * Usado em páginas client-side.
 */
export function useEvents(options: UseEventsOptions = {}): UseEventsResult {
  const { aberto, pagina = 0, tamanho = 9 } = options;

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [contador, setContador] = useState(0);

  const recarregar = useCallback(() => setContador((c) => c + 1), []);

  useEffect(() => {
    let cancelado = false;

    async function buscarEventos() {
      setCarregando(true);
      setErro(null);

      try {
        const params = new URLSearchParams({
          page: String(pagina),
          size: String(tamanho),
        });
        if (aberto !== undefined) {
          params.set("aberto", String(aberto));
        }

        const data = await api.get<PaginatedResponse<Evento>>(
          `/eventos?${params.toString()}`
        );

        if (!cancelado) {
          setEventos(data.content);
          setTotal(data.totalElements);
          setTotalPaginas(data.totalPages);
        }
      } catch (err) {
        if (!cancelado) {
          setErro(
            err instanceof Error ? err.message : "Erro ao carregar eventos."
          );
        }
      } finally {
        if (!cancelado) {
          setCarregando(false);
        }
      }
    }

    buscarEventos();
    return () => {
      cancelado = true;
    };
  }, [aberto, pagina, tamanho, contador]);

  return { eventos, total, totalPaginas, carregando, erro, recarregar };
}
