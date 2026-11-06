package br.org.institutoettore.api.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;

import java.util.HashMap;
import java.util.Map;

public class FrontendAuthorizationRequestResolver
    implements OAuth2AuthorizationRequestResolver {
    static final String REDIRECT_ATTRIBUTE = "frontend_redirect";
    private final DefaultOAuth2AuthorizationRequestResolver delegate;

    public FrontendAuthorizationRequestResolver(
        ClientRegistrationRepository clientRegistrationRepository
    ) {
        delegate = new DefaultOAuth2AuthorizationRequestResolver(
            clientRegistrationRepository,
            "/oauth2/authorization"
        );
    }

    @Override
    public OAuth2AuthorizationRequest resolve(HttpServletRequest request) {
        return adicionarRedirect(delegate.resolve(request), request);
    }

    @Override
    public OAuth2AuthorizationRequest resolve(
        HttpServletRequest request,
        String clientRegistrationId
    ) {
        return adicionarRedirect(delegate.resolve(request, clientRegistrationId), request);
    }

    private OAuth2AuthorizationRequest adicionarRedirect(
        OAuth2AuthorizationRequest authorizationRequest,
        HttpServletRequest request
    ) {
        if (authorizationRequest == null) {
            return null;
        }
        String redirect = request.getParameter("redirect");
        Map<String, Object> attributes = new HashMap<>(authorizationRequest.getAttributes());
        if (redirect != null && redirect.startsWith("/") && !redirect.startsWith("//")
            && !redirect.startsWith("/\\")) {
            attributes.put(REDIRECT_ATTRIBUTE, redirect);
        }
        return OAuth2AuthorizationRequest.from(authorizationRequest)
            .attributes(existing -> {
                existing.clear();
                existing.putAll(attributes);
            })
            .build();
    }
}
