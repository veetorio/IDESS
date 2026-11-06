package br.org.institutoettore.api.dto.projeto;

import br.org.institutoettore.api.dto.evento.EventoResponse;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ProjetoResponse(
    UUID id,
    String nome,
    String descricao,
    Integer participantes,
    String logo,
    List<String> fotos,
    Instant criadoEm,
    String status,
    EventoResponse ultimoEvento
) {}
