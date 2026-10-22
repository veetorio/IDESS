CREATE TABLE contas (
    id UUID PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefone VARCHAR(40) NOT NULL,
    senha VARCHAR(60) NOT NULL,
    atividade BOOLEAN NOT NULL DEFAULT TRUE,
    role VARCHAR(20) NOT NULL
);

CREATE TABLE eventos (
    id UUID PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    vagas_ocupadas INTEGER NOT NULL DEFAULT 0 CHECK (vagas_ocupadas >= 0),
    vagas_totais INTEGER NOT NULL CHECK (vagas_totais >= 1),
    aberto BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE evento_imgs (
    evento_id UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
    ordem INTEGER NOT NULL,
    img_path VARCHAR(2048) NOT NULL,
    PRIMARY KEY (evento_id, ordem)
);

CREATE TABLE inscricoes (
    id UUID PRIMARY KEY,
    inscrito_id UUID NOT NULL REFERENCES contas(id),
    evento_id UUID NOT NULL REFERENCES eventos(id),
    criado_em TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT uk_inscricao_conta_evento UNIQUE (inscrito_id, evento_id)
);

CREATE INDEX idx_eventos_aberto_criado_em ON eventos (aberto, criado_em DESC);
CREATE INDEX idx_inscricoes_inscrito_id ON inscricoes (inscrito_id);
