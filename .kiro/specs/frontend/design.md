# Design — Frontend Ettore Sebastianini Instituto Social e Sustentável

## Arquitetura

### Estrutura de Pastas (Next.js App Router)

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                  # Home
│   │   ├── eventos/
│   │   │   ├── page.tsx              # Listagem de eventos
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Detalhe do evento
│   ├── (auth)/
│   │   ├── entrar/
│   │   │   └── page.tsx              # Login
│   │   └── cadastrar/
│   │       └── page.tsx              # Registro
│   ├── (protected)/
│   │   └── minha-conta/
│   │       └── page.tsx              # Inscrições do usuário
│   ├── api/
│   │   └── auth/
│   │       ├── login/route.ts        # Proxy login + set cookie httpOnly
│   │       └── logout/route.ts       # Limpa cookie
│   ├── layout.tsx                    # Root layout
│   └── globals.css
├── components/
│   ├── ui/                           # shadcn/ui (gerado automaticamente)
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── MobileMenu.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── FoundersSection.tsx
│   │   ├── ProgramsSection.tsx
│   │   ├── RecentEventsSection.tsx
│   │   ├── SponsorsSection.tsx
│   │   └── ContactSection.tsx
│   ├── events/
│   │   ├── EventCard.tsx
│   │   ├── EventGrid.tsx
│   │   ├── EventGallery.tsx
│   │   └── EnrollButton.tsx
│   └── auth/
│       ├── LoginForm.tsx
│       └── RegisterForm.tsx
├── lib/
│   ├── api.ts                        # Cliente HTTP (fetch wrapper)
│   ├── auth.ts                       # Helpers JWT / decode token
│   └── utils.ts                      # cn() e utilitários gerais
├── hooks/
│   ├── useAuth.ts                    # Estado de autenticação
│   └── useEvents.ts                  # Fetch de eventos
├── types/
│   └── index.ts                      # Tipos TypeScript globais
└── middleware.ts                     # Proteção de rotas
```

---

## Design System

### Paleta de Cores

Regra 60-20-10-5 definida pelo cliente:

```css
/* 60% — Fundo principal (quase branco azulado) */
--color-base: #EEFCFF;

/* 20% — Primária (azul-roxo institucional) */
--color-primary: #2D2E7E;

/* 10% — Acento verde (sustentabilidade) */
--color-green: #13983F;

/* 5% — Acento azul (complementar) */
--color-blue: #1370B4;
```

Mapeamento em tokens Tailwind (`tailwind.config.ts`):
```ts
colors: {
  base:    '#EEFCFF',
  primary: { DEFAULT: '#2D2E7E', dark: '#1f2060' },
  green:   { DEFAULT: '#13983F', dark: '#0e7230' },
  blue:    { DEFAULT: '#1370B4', dark: '#0f5a91'  },
  // Neutros
  neutral: { 100: '#f5f5f5', 400: '#a3a3a3', 700: '#404040', 900: '#171717' },
}
```

### Tipografia

Fonte **Modernista** (geométrica, institucional moderna).

```css
/* Títulos — Modernista */
font-family: 'Modernista', sans-serif;

/* Fallback: 'DM Sans', 'Inter', sans-serif */

/* Escala */
--text-hero:  clamp(2.5rem, 5vw, 4rem);   /* Hero principal */
--text-h1:    clamp(2rem, 4vw, 3rem);
--text-h2:    clamp(1.5rem, 3vw, 2.25rem);
--text-h3:    1.5rem;
--text-body:  1rem;
--text-small: 0.875rem;
```

### Espaçamento

Seguir a escala padrão do Tailwind (base 4px). Seções da home com `py-20` (80px) para respiração visual.

### Bordas e Sombras

```css
--radius-card: 0.75rem;   /* rounded-xl */
--radius-btn:  0.5rem;    /* rounded-lg */
--shadow-card: 0 4px 6px -1px rgb(0 0 0 / 0.1);
```

---

## Componentes Principais

### EventCard

```tsx
interface EventCardProps {
  id: string
  nome: string
  descricao: string
  imagem: string
  data: string
  vagasOcupadas: number
  vagasTotais: number
  aberto: boolean
}
```

Exibe: imagem (aspect-video), badge status, nome, data formatada, barra de progresso de vagas.

### EnrollButton

- Estado: `idle | loading | enrolled | error`
- Desabilitado quando: evento fechado, vagas esgotadas, ou usuário já inscrito
- Redireciona para `/entrar` se não autenticado

### Header

- Logo à esquerda
- Links: Home, Sobre, Eventos, Contato
- Botão "Entrar" (não autenticado) ou Avatar/menu dropdown (autenticado)
- Mobile: hambúrguer com Sheet do shadcn/ui

---

## Fluxo de Autenticação

```
1. Usuário preenche /entrar
2. Frontend POST /api/auth/login (API Route Next.js)
3. API Route faz POST para backend Spring /auth/login
4. Recebe JWT → seta cookie httpOnly "token"
5. Retorna { user } para o cliente
6. Cliente armazena user no contexto (sem o JWT)
7. middleware.ts verifica cookie em rotas protegidas
```

### Middleware (src/middleware.ts)

```ts
// Rotas protegidas: /minha-conta
// Rotas de auth (redireciona se já logado): /entrar, /cadastrar
matcher: ['/(protected)/:path*', '/entrar', '/cadastrar']
```

---

## Tipos Globais (src/types/index.ts)

```ts
export interface Evento {
  id: string
  nome: string
  descricao: string
  imgs: string[]
  vagasOcupadas: number
  vagasTotais: number
  aberto: boolean
  inscritos?: Inscricao[]
  criadoEm: string
}

export interface Conta {
  id: string
  nome: string
  email: string
  telefone: string
  role: 'ADMIN' | 'COMMON'
  atividade: boolean
}

export interface Inscricao {
  id: string
  evento: Evento
  inscrito: Conta
}

export interface AuthResponse {
  token: string
  usuario: Conta
}
```

---

## Decisões Técnicas

| Decisão | Escolha | Motivo |
|---------|---------|--------|
| Renderização eventos | SSR (`fetch` sem cache) | Dados sempre atualizados |
| Renderização home | ISR (revalidate 3600s) | Performance + dados semi-estáticos |
| JWT storage | Cookie httpOnly via API Route | Segurança (não acessível por JS) |
| Estado global | React Context (AuthContext) | Simples, sem necessidade de Redux |
| Formulários | React Hook Form + Zod | Validação tipada e performática |
| HTTP client | fetch nativo (wrapper em lib/api.ts) | Sem dependência extra |
| Ícones | Lucide React | Já incluso no shadcn/ui |

---

## Páginas e Responsabilidades

| Rota | Renderização | Descrição |
|------|-------------|-----------|
| `/` | ISR | Home completa com todas as seções |
| `/eventos` | SSR | Listagem com filtro e paginação |
| `/eventos/[id]` | SSR | Detalhe + botão de inscrição |
| `/entrar` | CSR | Formulário de login |
| `/cadastrar` | CSR | Formulário de registro |
| `/minha-conta` | CSR (protegida) | Inscrições do usuário logado |
