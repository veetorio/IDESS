package br.org.institutoettore.api.config;

import br.org.institutoettore.api.domain.ProvedorSocial;
import br.org.institutoettore.api.dto.auth.TicketSocialResponse;
import br.org.institutoettore.api.exception.ConflitoException;
import br.org.institutoettore.api.exception.RequisicaoInvalidaException;
import br.org.institutoettore.api.service.EmailSocialNaoVerificadoException;
import br.org.institutoettore.api.service.LoginSocialService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Locale;

@Component
public class LoginSocialSuccessHandler implements AuthenticationSuccessHandler {
    private final LoginSocialService loginSocialService;
    private final String frontendUrl;

    public LoginSocialSuccessHandler(
        LoginSocialService loginSocialService,
        @Value("${app.social-login.frontend-url}") String frontendUrl
    ) {
        this.loginSocialService = loginSocialService;
        this.frontendUrl = frontendUrl.replaceAll("/+$", "");
    }

    @Override
    public void onAuthenticationSuccess(
        HttpServletRequest request,
        HttpServletResponse response,
        Authentication authentication
    ) throws IOException, ServletException {
        if (!(authentication.getPrincipal() instanceof OAuth2User principal)
            || !(authentication instanceof org.springframework.security.oauth2.client
                .authentication.OAuth2AuthenticationToken oauthToken)) {
            throw new OAuth2AuthenticationException("Identidade social inválida.");
        }

        ProvedorSocial provedor = ProvedorSocial.valueOf(
            oauthToken.getAuthorizedClientRegistrationId().toUpperCase(Locale.ROOT)
        );
        String subject = valor(principal, provedor == ProvedorSocial.GOOGLE ? "sub" : "id");
        String email = valor(principal, "email");
        String nome = valor(principal, "name");
        boolean emailVerificado = Boolean.TRUE.equals(
            principal.getAttributes().get("email_verified")
        );

        if (provedor == ProvedorSocial.GOOGLE && !emailVerificado) {
            redirecionarComErro(response, "email-nao-verificado");
            return;
        }

        try {
            TicketSocialResponse ticket = loginSocialService.criarTicket(
                provedor,
                subject,
                email,
                nome,
                emailVerificado
            );
            UriComponentsBuilder destino = UriComponentsBuilder
                .fromUriString(frontendUrl + "/entrar/social")
                .queryParam("ticket", ticket.ticket())
                .queryParam("novo", ticket.novoCadastro());
            Object redirect = request.getAttribute(
                FrontendAuthorizationRequestRepository.REQUEST_REDIRECT_ATTRIBUTE
            );
            if (redirect instanceof String path) {
                destino.queryParam("redirect", path);
            }
            response.setHeader("Cache-Control", "no-store");
            response.setHeader("Referrer-Policy", "no-referrer");
            response.sendRedirect(destino.build().encode().toUriString());
        } catch (EmailSocialNaoVerificadoException exception) {
            redirecionarComErro(response, "email-nao-verificado");
        } catch (ConflitoException | RequisicaoInvalidaException exception) {
            redirecionarComErro(response, "login-social-indisponivel");
        }
    }

    private String valor(OAuth2User principal, String atributo) {
        Object value = principal.getAttributes().get(atributo);
        return value instanceof String text ? text : null;
    }

    private void redirecionarComErro(HttpServletResponse response, String codigo)
        throws IOException {
        response.setHeader("Cache-Control", "no-store");
        response.setHeader("Referrer-Policy", "no-referrer");
        response.sendRedirect(
            UriComponentsBuilder.fromUriString(frontendUrl + "/entrar")
                .queryParam("erro", codigo)
                .build()
                .encode()
                .toUriString()
        );
    }
}
