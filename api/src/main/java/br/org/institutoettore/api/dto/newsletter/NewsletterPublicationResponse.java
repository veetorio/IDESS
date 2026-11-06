package br.org.institutoettore.api.dto.newsletter;

public record NewsletterPublicationResponse(
    NewsletterResponse newsletter,
    int emailsEnviados,
    int emailsFalhos,
    boolean envioConfigurado
) {}
