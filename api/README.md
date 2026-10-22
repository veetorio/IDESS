# API do Instituto Ettore

API REST em Spring Boot 3 e Java 21, com PostgreSQL, Flyway, JWT e BCrypt.

## Iniciar com Docker

1. Copie `.env.example` para `.env`, defina a senha do banco e gere um `JWT_SECRET` aleatório com pelo menos 32 bytes (por exemplo, `openssl rand -base64 48`).
2. Para criar o primeiro administrador, preencha `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `ADMIN_PHONE` (o nome pode ser personalizado em `ADMIN_NAME`). A senha deve ter entre 6 e 72 caracteres.
3. Inicie os serviços com `docker compose up --build`.
4. A API ficará disponível em `http://localhost:8080`; verifique `/health`.

As migrações do Flyway criam o schema ao iniciar. A conta administrativa só é criada se o e-mail configurado ainda não existir; o cadastro público sempre cria contas `COMMON`.

## Executar localmente

Configure PostgreSQL e as variáveis `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` e `DB_PASS`. Defina também `JWT_SECRET` (mínimo de 32 bytes), `CORS_ORIGINS` e, se necessário, as variáveis `ADMIN_*`.

```bash
mvn spring-boot:run
```

O perfil `dev` ativa logs SQL sem apagar ou recriar dados a cada reinicialização. O perfil `prod` exige que `JWT_SECRET` seja configurado.

## Endpoints

| Método | Caminho | Acesso | Descrição |
|---|---|---|---|
| `POST` | `/auth/register` | Público | Cria conta de participante |
| `POST` | `/auth/login` | Público | Autentica e retorna JWT e usuário |
| `GET` | `/eventos?page=0&size=9&aberto=true` | Público | Lista eventos paginados; `aberto` é opcional |
| `GET` | `/eventos/{id}` | Público | Detalha um evento |
| `POST` | `/eventos` | Admin | Cria evento |
| `PUT` | `/eventos/{id}` | Admin | Atualiza evento e permite encerrar inscrições |
| `GET` | `/inscricoes` | Autenticado | Lista as inscrições da própria conta |
| `POST` | `/inscricoes` | Conta `COMMON` | Inscreve a conta no evento |
| `GET` | `/health` | Público | Verifica se a API está respondendo |

Envie o token de login no cabeçalho `Authorization: Bearer <token>`. As imagens dos eventos são armazenadas como caminhos locais (`/caminho/imagem.jpg`) ou URLs HTTP(S); o serviço não recebe upload de arquivos.

O total de vagas é atualizado na mesma transação da inscrição, com bloqueio do evento para evitar ultrapassar a capacidade em requisições concorrentes. Atualizações administrativas do evento usam o mesmo bloqueio. Somente contas `COMMON` podem se inscrever; uma conta pode se inscrever uma única vez em cada evento.

## Testes

```bash
mvn test
```

Os testes de integração usam H2 em modo compatível com PostgreSQL e não precisam de uma instância PostgreSQL.

## Teste de carga

Com a API em execução e o k6 instalado:

```bash
k6 run load/k6-eventos.js
```

É possível apontar o teste para outro ambiente com `BASE_URL=https://api.exemplo.org`.
