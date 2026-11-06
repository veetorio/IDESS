ALTER TABLE eventos
    ADD COLUMN data_inicio DATE;

ALTER TABLE eventos
    ADD COLUMN data_fim DATE;

UPDATE eventos
SET data_inicio = CAST(criado_em AS DATE),
    data_fim = CAST(criado_em AS DATE);

ALTER TABLE eventos
    ALTER COLUMN data_inicio SET NOT NULL;

ALTER TABLE eventos
    ALTER COLUMN data_fim SET NOT NULL;

ALTER TABLE eventos
    ADD CONSTRAINT ck_eventos_periodo CHECK (data_fim >= data_inicio);
