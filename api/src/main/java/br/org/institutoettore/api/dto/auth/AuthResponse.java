package br.org.institutoettore.api.dto.auth;

import br.org.institutoettore.api.dto.conta.ContaResponse;

public record AuthResponse(
    String token,
    ContaResponse usuario
) {}
