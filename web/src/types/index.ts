// =============================================
// Tipos globais — ETTORE SEBASTIANINI INSTITUTO DE DESENVOLVIMENTO SOCIAL SUSTENTÁVEL
// Espelhados do modelo de dados do backend
// =============================================

export interface Contato {
  email: string;
  telefone: string;
}

export type Role = "ADMIN" | "COMMON";

export interface Conta {
  id: string;
  nome: string;
  contato: Contato;
  atividade: boolean;
  role: Role;
}

export interface Evento {
  id: string;
  nome: string;
  descricao: string;
  imgs: string[];
  vagasOcupadas: number;
  vagasTotais: number;
  aberto: boolean;
  criadoEm: string;
}

export interface Inscricao {
  id: string;
  inscrito: Conta;
  evento: Evento;
}

// ----------------------
// Payloads de API
// ----------------------

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface RegisterPayload {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  usuario: Conta;
}

// ----------------------
// Respostas paginadas
// ----------------------

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // página atual (0-indexed)
  size: number;
}

// ----------------------
// Erros de API
// ----------------------

export interface ApiError {
  message: string;
  status: number;
  timestamp?: string;
}
