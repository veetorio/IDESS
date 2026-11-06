export type CategoriaDashboard =
  | "eventos"
  | "noticias"
  | "usuarios_cadastrados"
  | "ajudas";

export interface AtividadeMensal {
  mes: string;
  eventos: number;
  noticias: number;
  usuarios_cadastrados: number;
  ajudas: number;
}

export interface ResumoCategoria {
  categoria: CategoriaDashboard;
  nome: string;
  total: number;
  crescimento: number;
}

export interface DashboardAtividadeResponse {
  ano: number;
  resumo: ResumoCategoria[];
  atividadesMensais: AtividadeMensal[];
  totalMensal: number;
}

export const dashboardAtividadeSeed: DashboardAtividadeResponse = {
  ano: 2026,
  totalMensal: 128,
  resumo: [
    { categoria: "eventos", nome: "Eventos", total: 34, crescimento: 12 },
    { categoria: "noticias", nome: "Notícias", total: 27, crescimento: 8 },
    { categoria: "usuarios_cadastrados", nome: "Usuários cadastrados", total: 49, crescimento: 18 },
    { categoria: "ajudas", nome: "Ajudas", total: 18, crescimento: 6 },
  ],
  atividadesMensais: [
    { mes: "Jan", eventos: 3, noticias: 2, usuarios_cadastrados: 5, ajudas: 1 },
    { mes: "Fev", eventos: 4, noticias: 2, usuarios_cadastrados: 6, ajudas: 2 },
    { mes: "Mar", eventos: 4, noticias: 3, usuarios_cadastrados: 5, ajudas: 2 },
    { mes: "Abr", eventos: 5, noticias: 4, usuarios_cadastrados: 7, ajudas: 3 },
    { mes: "Mai", eventos: 5, noticias: 3, usuarios_cadastrados: 8, ajudas: 2 },
    { mes: "Jun", eventos: 6, noticias: 4, usuarios_cadastrados: 9, ajudas: 3 },
    { mes: "Jul", eventos: 4, noticias: 3, usuarios_cadastrados: 8, ajudas: 2 },
    { mes: "Ago", eventos: 5, noticias: 4, usuarios_cadastrados: 9, ajudas: 3 },
    { mes: "Set", eventos: 6, noticias: 4, usuarios_cadastrados: 10, ajudas: 4 },
    { mes: "Out", eventos: 7, noticias: 5, usuarios_cadastrados: 11, ajudas: 4 },
    { mes: "Nov", eventos: 6, noticias: 4, usuarios_cadastrados: 12, ajudas: 3 },
    { mes: "Dez", eventos: 8, noticias: 5, usuarios_cadastrados: 13, ajudas: 4 },
  ],
};

export function getDashboardAtividadeData(): DashboardAtividadeResponse {
  return dashboardAtividadeSeed;
}
