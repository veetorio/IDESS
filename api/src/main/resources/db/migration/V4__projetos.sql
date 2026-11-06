CREATE TABLE projetos (
    id UUID PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    participantes INTEGER NOT NULL CHECK (participantes >= 0),
    logo VARCHAR(2048) NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE projeto_fotos (
    projeto_id UUID NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
    ordem INTEGER NOT NULL,
    foto_path VARCHAR(2048) NOT NULL,
    PRIMARY KEY (projeto_id, ordem)
);

ALTER TABLE eventos
    ADD COLUMN projeto_id UUID REFERENCES projetos(id) ON DELETE SET NULL;

CREATE INDEX idx_eventos_projeto_periodo
    ON eventos (projeto_id, data_inicio DESC);
