package br.org.institutoettore.api.dto.newsletter;

public record NewsletterPreferenceResponse(
    String email,
    boolean recebeNewsletter
) {}
