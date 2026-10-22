import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes CSS com suporte a Tailwind merge.
 * Usado em todos os componentes no lugar de concatenação manual.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata uma data ISO para o padrão pt-BR.
 * Exemplo: "2024-06-15T10:00:00Z" → "15 de junho de 2024"
 */
export function formatarData(dataIso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dataIso));
}

/**
 * Retorna a contagem de vagas restantes de um evento.
 */
export function vagasRestantes(ocupadas: number, totais: number): number {
  return Math.max(0, totais - ocupadas);
}

/**
 * Verifica se um evento tem vagas disponíveis e está aberto.
 */
export function eventoDisponivel(
  aberto: boolean,
  vagasOcupadas: number,
  vagasTotais: number
): boolean {
  return aberto && vagasOcupadas < vagasTotais;
}
