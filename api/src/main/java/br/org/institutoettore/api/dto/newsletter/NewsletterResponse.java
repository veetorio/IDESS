package br.org.institutoettore.api.dto.newsletter;

import java.time.Instant;
import java.util.UUID;

public record NewsletterResponse(
    UUID id,
    String titulo,
    String resumo,
    String conteudo,
    Instant criadoEm,
    Instant publicadoEm
) {}
