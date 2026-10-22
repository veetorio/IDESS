package br.org.institutoettore.api.dto.inscricao;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record InscricaoRequest(
    @NotNull(message = "ID do evento é obrigatório")
    UUID eventoId
) {}
