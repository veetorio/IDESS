package br.org.institutoettore.api.dto.evento;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record EventoResponse(
    UUID id,
    String nome,
    String descricao,
    List<String> imgs,
    Integer vagasOcupadas,
    Integer vagasTotais,
    Boolean aberto,
    Instant criadoEm
) {}
