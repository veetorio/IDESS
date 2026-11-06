package br.org.institutoettore.api.dto.newsletter;

import jakarta.validation.constraints.NotNull;

public record NewsletterPreferenceRequest(
    @NotNull(message = "Informe se deseja receber newsletters.")
    Boolean recebeNewsletter
) {}
