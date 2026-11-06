package br.org.institutoettore.api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.santander")
public record SantanderProperties(
        boolean enabled,
        String environment,
        String apiBaseUrl,
        String clientId,
        String clientSecret,
        String certificatePath,
        String privateKeyPath,
        String pixKey
) {
}
