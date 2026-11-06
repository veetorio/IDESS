package br.org.institutoettore.api.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.config.oauth2.client.CommonOAuth2Provider;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;

import java.util.ArrayList;
import java.util.List;

@Configuration
@ConditionalOnProperty(name = "app.social-login.enabled", havingValue = "true")
public class LoginSocialOAuthConfiguration {
    @Bean
    ClientRegistrationRepository clientRegistrationRepository(
        org.springframework.core.env.Environment environment
    ) {
        List<ClientRegistration> registrations = new ArrayList<>();
        adicionarGoogle(environment, registrations);
        adicionarFacebook(environment, registrations);
        if (registrations.isEmpty()) {
            throw new IllegalStateException(
                "Defina GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET ou "
                    + "FACEBOOK_CLIENT_ID/FACEBOOK_CLIENT_SECRET para habilitar o login social."
            );
        }
        return new InMemoryClientRegistrationRepository(registrations);
    }

    private void adicionarGoogle(
        org.springframework.core.env.Environment environment,
        List<ClientRegistration> registrations
    ) {
        String clientId = environment.getProperty("GOOGLE_CLIENT_ID", "").trim();
        String clientSecret = environment.getProperty("GOOGLE_CLIENT_SECRET", "").trim();
        validarPar("Google", clientId, clientSecret);
        if (!clientId.isEmpty()) {
            registrations.add(CommonOAuth2Provider.GOOGLE.getBuilder("google")
                .clientId(clientId)
                .clientSecret(clientSecret)
                .scope("openid", "profile", "email")
                .redirectUri("{baseUrl}/login/oauth2/code/{registrationId}")
                .build());
        }
    }

    private void adicionarFacebook(
        org.springframework.core.env.Environment environment,
        List<ClientRegistration> registrations
    ) {
        String clientId = environment.getProperty("FACEBOOK_CLIENT_ID", "").trim();
        String clientSecret = environment.getProperty("FACEBOOK_CLIENT_SECRET", "").trim();
        validarPar("Facebook", clientId, clientSecret);
        if (!clientId.isEmpty()) {
            String versao = environment.getProperty("FACEBOOK_GRAPH_VERSION", "v26.0").trim();
            if (!versao.matches("v\\d+\\.\\d+")) {
                throw new IllegalStateException("FACEBOOK_GRAPH_VERSION inválida.");
            }
            registrations.add(ClientRegistration.withRegistrationId("facebook")
                .clientId(clientId)
                .clientSecret(clientSecret)
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_POST)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .redirectUri("{baseUrl}/login/oauth2/code/{registrationId}")
                .scope("email", "public_profile")
                .authorizationUri("https://www.facebook.com/" + versao + "/dialog/oauth")
                .tokenUri("https://graph.facebook.com/" + versao + "/oauth/access_token")
                .userInfoUri(
                    "https://graph.facebook.com/" + versao + "/me?fields=id,name,email"
                )
                .userNameAttributeName("id")
                .clientName("Facebook")
                .build());
        }
    }

    private void validarPar(String provedor, String clientId, String clientSecret) {
        if (clientId.isEmpty() != clientSecret.isEmpty()) {
            throw new IllegalStateException(
                "Configure o client ID e o client secret do " + provedor + " juntos."
            );
        }
    }
}
