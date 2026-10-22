# Tasks — Frontend Ettore Sebastianini Instituto Social e Sustentável

## Fase 1 — Setup e Infraestrutura

- [ ] 1. Inicializar projeto Next.js 14 com TypeScript e Tailwind CSS
  - `npx create-next-app@latest` com App Router, TypeScript, Tailwind
  - Configurar `tsconfig.json` com path aliases (`@/` → `src/`)
  - Requisito: base do projeto funcional

- [ ] 2. Instalar e configurar shadcn/ui
  - `npx shadcn-ui@latest init`
  - Adicionar componentes base: Button, Card, Badge, Sheet, Dialog, Toast, Input, Form
  - Configurar tema com a paleta de cores do design system (verde primário, âmbar secundário)

- [ ] 3. Configurar Vitest
  - Instalar `vitest`, `@testing-library/react`, `@testing-library/user-event`, `jsdom`
  - Criar `vitest.config.ts`
  - Criar teste de smoke inicial

- [ ] 4. Definir tipos globais
  - Criar `src/types/index.ts` com: `Evento`, `Conta`, `Inscricao`, `AuthResponse`
  - Baseado no diagrama de classes do backend

- [ ] 5. Criar cliente HTTP
  - Criar `src/lib/api.ts` com wrapper de `fetch`
  - Suporte a: headers de autorização, base URL via env, tratamento de erros padronizado
  - Criar `src/lib/auth.ts` com helpers de decode/validação do JWT
  - Criar `.env.local.example` com `NEXT_PUBLIC_API_URL`

---

## Fase 2 — Layout Global

- [ ] 6. Criar layout raiz e componentes de estrutura
  - `src/app/layout.tsx` com fonte Inter, metadata do instituto, providers
  - `src/components/layout/Header.tsx`: logo, links de navegação, botão entrar/perfil
  - `src/components/layout/Footer.tsx`: informações institucionais, links, redes sociais
  - `src/components/layout/MobileMenu.tsx`: Sheet do shadcn com links de navegação

- [ ] 7. Implementar middleware de proteção de rotas
  - `src/middleware.ts` verificando cookie `token`
  - Redirecionar `/minha-conta` → `/entrar` se não autenticado
  - Redirecionar `/entrar`, `/cadastrar` → `/` se já autenticado

- [ ] 8. Criar AuthContext
  - `src/hooks/useAuth.ts` com Context de autenticação
  - Estado: `{ usuario: Conta | null, loading: boolean }`
  - Funções: `login()`, `logout()`, `register()`
  - Provider envolvendo o layout raiz

---

## Fase 3 — Autenticação

- [ ] 9. Criar API Routes de autenticação
  - `src/app/api/auth/login/route.ts`: recebe credenciais, chama Spring, seta cookie httpOnly
  - `src/app/api/auth/logout/route.ts`: limpa cookie e redireciona
  - Cookie: `token`, httpOnly, sameSite: strict, secure em produção

- [ ] 10. Criar página de Login
  - `src/app/(auth)/entrar/page.tsx`
  - `src/components/auth/LoginForm.tsx` com React Hook Form + Zod
  - Campos: e-mail, senha
  - Validação: e-mail válido, senha mínimo 6 caracteres
  - Exibir erros inline, loading state no botão

- [ ] 11. Criar página de Cadastro
  - `src/app/(auth)/cadastrar/page.tsx`
  - `src/components/auth/RegisterForm.tsx` com React Hook Form + Zod
  - Campos: nome completo, e-mail, telefone, senha, confirmar senha
  - Validação com Zod schema
  - Após sucesso: redirecionar para `/entrar`

---

## Fase 4 — Página Home

- [ ] 12. Criar seção Hero
  - `src/components/home/HeroSection.tsx`
  - Título principal, subtítulo com missão do instituto, botão CTA "Conheça nossos eventos"
  - Background com imagem ou gradiente verde

- [ ] 13. Criar seção Sobre
  - `src/components/home/AboutSection.tsx`
  - Texto descritivo do instituto, missão, visão e valores
  - Layout em duas colunas (texto + imagem) em desktop

- [ ] 14. Criar seção Fundadores
  - `src/components/home/FoundersSection.tsx`
  - Grid de cards com foto, nome e bio resumida de cada fundador
  - Dados estáticos inicialmente (array de objetos no componente)

- [ ] 15. Criar seção Programas
  - `src/components/home/ProgramsSection.tsx`
  - Cards com ícone, nome e descrição curta de cada programa
  - Dados estáticos inicialmente

- [ ] 16. Criar seção Eventos Recentes
  - `src/components/home/RecentEventsSection.tsx`
  - Buscar 3 eventos mais recentes da API (SSR/ISR)
  - Reusar componente `EventCard`
  - Link "Ver todos os eventos" ao final

- [ ] 17. Criar seção Patrocinadores
  - `src/components/home/SponsorsSection.tsx`
  - Grid ou carrossel com logos dos patrocinadores
  - Dados estáticos (array de { nome, logo, url })

- [ ] 18. Criar seção Contato
  - `src/components/home/ContactSection.tsx`
  - Formulário: nome, e-mail, mensagem (envio via mailto ou endpoint futuro)
  - Informações de contato: e-mail, telefone, endereço
  - Mapa ou placeholder de localização

- [ ] 19. Montar página Home
  - `src/app/(public)/page.tsx` compondo todas as seções
  - Configurar ISR com `revalidate: 3600`

---

## Fase 5 — Eventos

- [ ] 20. Criar componente EventCard
  - `src/components/events/EventCard.tsx`
  - Props: `Evento`
  - Exibir: imagem (next/image), badge de status, nome, data formatada, vagas (X/Y)
  - Link para `/eventos/[id]`

- [ ] 21. Criar página de Listagem de Eventos
  - `src/app/(public)/eventos/page.tsx`
  - Buscar eventos da API com SSR
  - `src/components/events/EventGrid.tsx` com grid responsivo
  - Filtro por status (aberto/fechado) via searchParams
  - Paginação simples

- [ ] 22. Criar componente EnrollButton
  - `src/components/events/EnrollButton.tsx`
  - Estados: idle, loading, enrolled, error
  - Lógica: não autenticado → link para /entrar; evento fechado/sem vagas → desabilitado; já inscrito → mensagem
  - POST para `/api/inscricoes` (ou diretamente para o backend via lib/api.ts)

- [ ] 23. Criar página de Detalhe do Evento
  - `src/app/(public)/eventos/[id]/page.tsx`
  - Buscar evento por ID com SSR
  - `src/components/events/EventGallery.tsx` para galeria de imagens
  - Exibir: nome, descrição completa, galeria, vagas, status
  - Incluir `EnrollButton`
  - Metadata dinâmica (título da página = nome do evento)

---

## Fase 6 — Área do Usuário

- [ ] 24. Criar página Minha Conta
  - `src/app/(protected)/minha-conta/page.tsx`
  - Rota protegida (middleware já configurado na Task 7)
  - Buscar inscrições do usuário autenticado
  - Listar eventos inscritos com status e data
  - Exibir dados do perfil (nome, e-mail)

---

## Fase 7 — Qualidade e Finalização

- [ ] 25. Testes unitários dos componentes críticos
  - `LoginForm`: validação de campos, submissão, erro de credenciais
  - `EnrollButton`: estados, redirecionamento, feedback
  - `EventCard`: renderização correta dos dados

- [ ] 26. Testes de integração das API Routes
  - `/api/auth/login`: sucesso e erro
  - `/api/auth/logout`: limpeza de cookie

- [ ] 27. Acessibilidade e responsividade
  - Revisar contraste de cores (mínimo 4.5:1)
  - Testar navegação por teclado em todos os formulários e modais
  - Validar layout em 320px, 768px e 1280px

- [ ] 28. Variáveis de ambiente e configuração de produção
  - Documentar todas as env vars necessárias
  - Configurar `next.config.js`: domínios de imagens, headers de segurança
  - Criar `Dockerfile` para containerização

- [ ] 29. Criar steering file do projeto
  - `.kiro/steering/projeto.md` com convenções, comandos de build/test e decisões arquiteturais
  - Facilitar onboarding de novos contribuidores
