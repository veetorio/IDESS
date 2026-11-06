package br.org.institutoettore.api.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class LoginSocialFailureHandler implements AuthenticationFailureHandler {
    private final String frontendUrl;

    public LoginSocialFailureHandler(
        @Value("${app.social-login.frontend-url}") String frontendUrl
    ) {
        this.frontendUrl = frontendUrl.replaceAll("/+$", "");
    }

    @Override
    public void onAuthenticationFailure(
        HttpServletRequest request,
        HttpServletResponse response,
        AuthenticationException exception
    ) throws IOException, ServletException {
        response.setHeader("Cache-Control", "no-store");
        response.setHeader("Referrer-Policy", "no-referrer");
        response.sendRedirect(
            UriComponentsBuilder.fromUriString(frontendUrl + "/entrar")
                .queryParam("erro", "login-social")
                .build()
                .encode()
                .toUriString()
        );
    }
}
