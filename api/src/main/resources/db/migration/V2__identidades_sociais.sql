CREATE TABLE contas_identidades_sociais (
    id UUID PRIMARY KEY,
    conta_id UUID NOT NULL REFERENCES contas(id) ON DELETE CASCADE,
    provedor VARCHAR(20) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    CONSTRAINT uk_identidade_social_provedor_subject UNIQUE (provedor, subject),
    CONSTRAINT uk_identidade_social_conta_provedor UNIQUE (conta_id, provedor)
);

CREATE TABLE tickets_login_social (
    token_hash VARCHAR(64) PRIMARY KEY,
    provedor VARCHAR(20) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email_verificado BOOLEAN NOT NULL,
    conta_id UUID REFERENCES contas(id) ON DELETE CASCADE,
    expira_em TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_tickets_login_social_expira_em ON tickets_login_social (expira_em);
