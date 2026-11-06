# API do Instituto Ettore

API REST em Spring Boot 3 e Java 21, com PostgreSQL, Flyway, JWT e BCrypt.

## Iniciar com Docker

1. Copie `.env.example` para `.env`, defina a senha do banco e gere um `JWT_SECRET` aleatório com pelo menos 32 bytes (por exemplo, `openssl rand -base64 48`).
2. Para criar o primeiro administrador, preencha `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `ADMIN_PHONE` (o nome pode ser personalizado em `ADMIN_NAME`). A senha deve ter entre 6 e 72 caracteres.
3. Inicie os serviços com `docker compose up --build`.
4. A API ficará disponível em `http://localhost:8080`; verifique `/health`.

As migrações do Flyway criam o schema ao iniciar. A conta administrativa só é criada se o e-mail configurado ainda não existir; o cadastro público sempre cria contas `COMMON`. Imagens enviadas são aceitas em JPEG, PNG ou GIF, até 10 arquivos de 5 MB por evento, e persistidas no volume Docker `evento_imagens`.

## Newsletter

Administradores publicam novidades em `/admin/newsletter`. Usuários `COMMON` autenticados podem ler as edições em Minha Conta e ativar ou cancelar o recebimento por e-mail. O envio é opcional e fica desabilitado até configurar o SMTP:

```env
NEWSLETTER_EMAIL_ENABLED=true
NEWSLETTER_EMAIL_FROM=newsletter@instituto.org.br
NEWSLETTER_SMTP_HOST=smtp.exemplo.org
NEWSLETTER_SMTP_PORT=587
NEWSLETTER_SMTP_USERNAME=usuario-smtp
NEWSLETTER_SMTP_PASSWORD=senha-smtp
NEWSLETTER_SMTP_AUTH=true
NEWSLETTER_SMTP_STARTTLS=true
```

Mantenha as credenciais SMTP somente em variáveis de ambiente/segredos do ambiente de execução. Sem SMTP, as novidades são publicadas e ficam disponíveis na área dos usuários; a tela administrativa informa que o envio por e-mail não está configurado.

## Santander (preparação de configuração)

O backend reconhece as propriedades abaixo, mas ainda não cria cobranças nem chama a API Santander. Mantenha `SANTANDER_ENABLED=false` até que a integração seja implementada e validada com as especificações do produto contratado. Os requisitos de autenticação, certificados e URLs variam conforme a API Santander habilitada para a instituição.

```env
SANTANDER_ENABLED=false
SANTANDER_ENVIRONMENT=sandbox
SANTANDER_API_BASE_URL=
SANTANDER_CLIENT_ID=
SANTANDER_CLIENT_SECRET=
SANTANDER_CERTIFICATE_PATH=
SANTANDER_PRIVATE_KEY_PATH=
SANTANDER_PIX_KEY=
```

Configure segredos apenas no ambiente de execução, nunca no repositório. Se a API exigir certificado e chave, disponibilize os arquivos ao container por um mecanismo de secrets ou volume somente leitura e informe os caminhos internos do container nas variáveis correspondentes. Não compartilhe credenciais no chat.

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
| `POST` | `/eventos` | Admin | Cria evento; recebe `multipart/form-data` com a parte JSON `evento` e partes `imagens` opcionais |
| `PUT` | `/eventos/{id}` | Admin | Atualiza evento e permite encerrar inscrições |
| `GET` | `/inscricoes` | Autenticado | Lista as inscrições da própria conta |
| `POST` | `/inscricoes` | Conta `COMMON` | Inscreve a conta no evento |
| `GET` | `/newsletter` | Conta autenticada | Lista as novidades publicadas |
| `GET`, `PUT` | `/newsletter/preferencia` | Conta `COMMON` | Consulta ou altera a adesão ao recebimento de e-mails |
| `GET`, `POST` | `/newsletter/admin` | Admin | Lista ou publica novidades e envia aos inscritos |
| `GET` | `/health` | Público | Verifica se a API está respondendo |

Envie o token de login no cabeçalho `Authorization: Bearer <token>`. Para criar evento, envie o JSON com `nome`, `descricao`, `vagasTotais` e `aberto` na parte `evento`, além de cada arquivo na parte `imagens`. A API retorna os caminhos públicos `/uploads/<nome-gerado>`.

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
