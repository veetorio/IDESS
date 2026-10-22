package br.org.institutoettore.api.dto.inscricao;

import br.org.institutoettore.api.dto.conta.ContaResponse;
import br.org.institutoettore.api.dto.evento.EventoResponse;

import java.time.Instant;
import java.util.UUID;

public record InscricaoResponse(
    UUID id,
    ContaResponse inscrito,
    EventoResponse evento,
    Instant criadoEm
) {}
