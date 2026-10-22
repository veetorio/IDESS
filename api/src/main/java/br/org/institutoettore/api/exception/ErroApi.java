package br.org.institutoettore.api.exception;

import java.time.Instant;
import java.util.Map;

public record ErroApi(
    String message,
    int status,
    Instant timestamp,
    Map<String, String> campos
) {}
