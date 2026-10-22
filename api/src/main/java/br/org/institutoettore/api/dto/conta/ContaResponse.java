package br.org.institutoettore.api.dto.conta;

import br.org.institutoettore.api.domain.Role;

import java.util.UUID;

public record ContaResponse(
    UUID id,
    String nome,
    ContatoResponse contato,
    Boolean atividade,
    Role role
) {}
