# Contexto do Projeto — ETTORE SEBASTIANINI INSTITUTO DE DESENVOLVIMENTO SOCIAL SUSTENTÁVEL

## Sobre

Site institucional do **ETTORE SEBASTIANINI INSTITUTO DE DESENVOLVIMENTO SOCIAL SUSTENTÁVEL**. O objetivo é divulgar eventos, apresentar o instituto, seus fundadores, programas e patrocinadores, além de permitir que o público geral se inscreva em eventos.

## Repositório

Este repositório é o **frontend**. O backend (Spring Framework + PostgreSQL) está em repositório separado.

## Stack

- **Next.js 14** com App Router
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Vitest** para testes
- **React Hook Form** + **Zod** para formulários
- Autenticação via **JWT** (cookie httpOnly gerenciado por API Routes do Next.js)

## Convenções

### Idioma
Todo o conteúdo do site e comentários de código em **português (pt-BR)**.

### Nomenclatura
- Componentes: PascalCase (`EventCard`, `HeroSection`)
- Hooks: camelCase com prefixo `use` (`useAuth`, `useEvents`)
- Arquivos de página: `page.tsx` (convenção Next.js App Router)
- Tipos: PascalCase em `src/types/index.ts`

### Estrutura de pastas
```
src/
├── app/           # Rotas Next.js (App Router)
├── components/    # Componentes React organizados por domínio
├── hooks/         # Custom hooks
├── lib/           # Utilitários, cliente HTTP, helpers
└── types/         # Tipos TypeScript globais
```

### Componentes
- Sempre usar componentes do **shadcn/ui** antes de criar novos componentes de UI
- Ícones via **Lucide React** (já incluso no shadcn/ui)
- Imagens via `next/image` obrigatoriamente

### Autenticação
- JWT armazenado em **cookie httpOnly** (nunca em localStorage)
- Cookie gerenciado pelas API Routes em `src/app/api/auth/`
- Estado do usuário via `AuthContext` (sem o token, apenas dados do usuário)
- Rotas protegidas via `src/middleware.ts`

### Formulários
- **React Hook Form** + **Zod** para todos os formulários
- Validação no cliente antes de chamar a API
- Erros exibidos inline abaixo de cada campo

### Chamadas de API
- Usar o wrapper em `src/lib/api.ts` (nunca fetch direto espalhado pelos componentes)
- URL base via variável de ambiente `NEXT_PUBLIC_API_URL`

## Comandos

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Rodar testes
npm run test

# Testes em modo watch
npm run test:watch

# Lint
npm run lint
```

## Variáveis de Ambiente

```env
NEXT_PUBLIC_API_URL=http://localhost:8080   # URL do backend Spring
JWT_SECRET=                                  # Apenas no servidor (API Routes)
```

## Design System

### Paleta de Cores (regra 60-20-10-5)

| Proporção | Hex       | Uso                              |
|-----------|-----------|----------------------------------|
| 60%       | `#EEFCFF` | Fundo principal de todas as páginas |
| 20%       | `#2D2E7E` | Cor primária — textos, botões, header |
| 10%       | `#13983F` | Acento verde — sustentabilidade, badges, CTAs secundários |
| 5%        | `#1370B4` | Acento azul — links, destaques complementares |

### Tipografia
- Fonte: **Modernista** (geométrica, institucional)
- Fallback: `DM Sans`, `Inter`, `sans-serif`

---

## Modelo de Dados (espelhado do backend)

```ts
Evento      { id, nome, descricao, imgs[], vagasOcupadas, vagasTotais, aberto, criadoEm }
Conta       { id, nome, email, telefone, role: 'ADMIN'|'COMMON', atividade }
Inscricao   { id, evento: Evento, inscrito: Conta }
```

## Spec completa

Ver `.kiro/specs/frontend/` para requisitos, design e tasks detalhadas.
