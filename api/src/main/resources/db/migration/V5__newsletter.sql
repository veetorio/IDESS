ALTER TABLE contas
    ADD COLUMN recebe_newsletter BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE newsletters (
    id UUID PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    resumo VARCHAR(300) NOT NULL,
    conteudo TEXT NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE NOT NULL,
    publicado_em TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_newsletters_publicado_em
    ON newsletters (publicado_em DESC);
