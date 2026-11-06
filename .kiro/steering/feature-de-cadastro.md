# Login social

## Objetivo

Permitir que as pessoas entrem no sistema com Google ou Facebook, mantendo também o login atual por e-mail e senha. Após a autenticação no provedor, o backend deve localizar ou criar a conta local e emitir o JWT usado pelo sistema.

## Fluxo

- O frontend inicia OAuth 2.0 no backend por `/oauth2/authorization/google` ou `/oauth2/authorization/facebook`.
- O backend valida a identidade com o provedor e associa a identidade pelo identificador estável do provedor, nunca por dados enviados pelo navegador.
- Se não houver identidade vinculada, o backend pode associar automaticamente a conta encontrada pelo e-mail somente quando o provedor confirmar que o e-mail foi verificado.
- Se não houver conta, criar uma conta `COMMON`. Como telefone é obrigatório no modelo local, solicitá-lo antes de concluir o cadastro.
- Emitir um ticket aleatório, de uso único e curta duração. O frontend troca o ticket pelo JWT através de uma rota server-side e o armazena em cookie `httpOnly`.
- Preservar o destino local solicitado antes do login e rejeitar redirecionamentos externos.

## Regras de segurança e conta

- Nunca expor client secrets no frontend nem aceitar perfil/e-mail como prova de identidade.
- O ticket de retorno deve ser armazenado somente como hash, expirar em cinco minutos e ser invalidado ao ser utilizado.
- Para Google, exigir `email_verified=true` para a associação automática por e-mail.
- O perfil do Facebook não fornece um indicador explícito de e-mail verificado. Portanto, não associar automaticamente por e-mail uma conta existente quando essa confirmação não estiver presente; permitir login por uma identidade Facebook já associada.
- Contas sociais novas recebem papel `COMMON`. Não alterar papel, senha, telefone ou dados de contas existentes ao associar um provedor.
- Manter credenciais de desenvolvimento e produção separadas e habilitar os provedores somente depois de cadastrar URLs de callback e credenciais nos respectivos consoles.

## Configuração OAuth

Redirect URIs de desenvolvimento:

- Google: `http://localhost:8081/login/oauth2/code/google`
- Facebook: `http://localhost:8081/login/oauth2/code/facebook`

Variáveis do backend: `SOCIAL_LOGIN_ENABLED`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`, `FACEBOOK_GRAPH_VERSION` e `FRONTEND_URL`.

O frontend só exibe cada botão quando sua variável pública correspondente estiver como `true`: `NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED` ou `NEXT_PUBLIC_FACEBOOK_LOGIN_ENABLED`. Não colocar segredos em variáveis `NEXT_PUBLIC_*`.
