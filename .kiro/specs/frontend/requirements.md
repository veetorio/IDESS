# Requisitos — Frontend ETTORE SEBASTIANINI INSTITUTO DE DESENVOLVIMENTO SOCIAL SUSTENTÁVEL

## Introdução

Site institucional do **ETTORE SEBASTIANINI INSTITUTO DE DESENVOLVIMENTO SOCIAL SUSTENTÁVEL**, com foco em divulgação de eventos, apresentação do instituto e inscrição do público geral. O site é voltado para dois públicos: patrocinadores e público geral.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Estilização:** Tailwind CSS + shadcn/ui
- **Linguagem:** TypeScript
- **Testes:** Vitest
- **Autenticação:** JWT (integrado com API Spring)
- **Idioma:** Português

---

## Requisitos Funcionais

### RF-01 — Página Home

**Descrição:** Página principal do site com as seguintes seções:

- **Hero:** Apresentação do instituto com nome, missão e chamada para ação
- **Sobre o Instituto:** Texto descritivo, missão, visão e valores
- **Fundadores:** Cards com foto, nome e breve bio de cada fundador
- **Programas:** Listagem dos programas sociais/sustentáveis da instituição
- **Eventos Recentes:** Grid com os últimos eventos cadastrados (máx. 3)
- **Patrocinadores:** Logos dos patrocinadores em carrossel ou grid
- **Contato:** Formulário de contato (nome, e-mail, mensagem) + informações de contato

**Critérios de aceitação:**
- Todas as seções devem ser acessíveis via âncora no menu de navegação
- Eventos recentes devem ser carregados dinamicamente da API
- Logos de patrocinadores devem ser configuráveis via CMS ou dados estáticos inicialmente

---

### RF-02 — Página de Listagem de Eventos

**Descrição:** Página `/eventos` com todos os eventos disponíveis.

- Grid responsivo de cards de eventos
- Cada card exibe: imagem, nome, data, vagas disponíveis e status (aberto/fechado)
- Filtro por status (aberto/fechado)
- Paginação

**Critérios de aceitação:**
- Eventos com `aberto: false` devem exibir badge "Encerrado"
- Vagas exibidas como `vagasOcupadas / vagasTotais`
- Clicar no card navega para a página de detalhe

---

### RF-03 — Página de Detalhe do Evento

**Descrição:** Página `/eventos/[id]` com informações completas do evento.

- Nome, descrição completa, galeria de imagens
- Vagas disponíveis e total
- Status do evento (aberto/fechado)
- Botão de inscrição (visível apenas para usuários autenticados com role COMMON)
- Caso não autenticado: exibir botão "Entrar para se inscrever"

**Critérios de aceitação:**
- Botão de inscrição desabilitado quando `aberto: false` ou vagas esgotadas
- Confirmação de inscrição via modal ou toast
- Usuário já inscrito deve ver mensagem "Você já está inscrito neste evento"

---

### RF-04 — Autenticação

**Descrição:** Fluxo de autenticação JWT integrado com a API Spring.

- Página `/entrar` com formulário de login (e-mail + senha)
- Página `/cadastrar` com formulário de criação de conta (nome, e-mail, telefone, senha)
- Armazenamento do JWT em cookie httpOnly (via API route do Next.js)
- Logout limpa o cookie e redireciona para home

**Critérios de aceitação:**
- Erros de autenticação exibidos inline no formulário
- Redirecionamento para a página de origem após login bem-sucedido
- Sessão persistida entre recarregamentos de página

---

### RF-05 — Inscrição em Eventos

**Descrição:** Público geral autenticado pode se inscrever em eventos abertos.

- POST para `/inscricoes` com o ID do evento
- Confirmação visual imediata após inscrição
- Usuário pode ver suas inscrições em `/minha-conta`

**Critérios de aceitação:**
- Inscrição apenas para usuários com role `COMMON`
- Feedback de erro caso o evento esteja fechado ou sem vagas
- Página `/minha-conta` lista os eventos nos quais o usuário está inscrito

---

### RF-06 — Navegação e Layout

**Descrição:** Layout global consistente em todas as páginas.

- Header com logo do instituto, links de navegação e botão de login/perfil
- Footer com informações institucionais, links úteis e redes sociais
- Navegação responsiva (menu hambúrguer em mobile)

**Critérios de aceitação:**
- Header fixo no topo (sticky)
- Menu mobile acessível via teclado
- Footer presente em todas as páginas exceto `/entrar` e `/cadastrar`

---

## Requisitos Não Funcionais

### RNF-01 — Performance
- LCP (Largest Contentful Paint) < 2.5s
- Imagens otimizadas com `next/image`
- Rotas com SSR para páginas de eventos (dados sempre atualizados)

### RNF-02 — Acessibilidade
- Conformidade WCAG 2.1 nível AA
- Contraste mínimo 4.5:1 para textos
- Navegação completa por teclado

### RNF-03 — Responsividade
- Layout funcional em mobile (320px+), tablet (768px+) e desktop (1280px+)

### RNF-04 — Segurança
- JWT armazenado em cookie httpOnly (não acessível via JavaScript)
- Rotas protegidas com middleware do Next.js
- Inputs sanitizados antes de envio para a API

### RNF-05 — Internacionalização
- Idioma: Português (pt-BR)
- Textos hardcoded em português, sem necessidade de i18n por ora

---

## Integrações

| Endpoint         | Método | Descrição                        |
|-----------------|--------|----------------------------------|
| `/auth/login`   | POST   | Autenticação, retorna JWT        |
| `/auth/register`| POST   | Criação de conta                 |
| `/eventos`      | GET    | Listagem de eventos              |
| `/eventos/:id`  | GET    | Detalhe de um evento             |
| `/inscricoes`   | POST   | Inscrever usuário em um evento   |
| `/inscricoes`   | GET    | Listar inscrições do usuário     |

---

## Fora do Escopo (Frontend)

- Painel administrativo (criação/edição de eventos é responsabilidade do backend/admin)
- Upload de imagens pelo frontend
- Sistema de pagamento
