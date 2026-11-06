package br.org.institutoettore.api.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.client.web.HttpSessionOAuth2AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;

public class FrontendAuthorizationRequestRepository
    implements AuthorizationRequestRepository<OAuth2AuthorizationRequest> {
    static final String REQUEST_REDIRECT_ATTRIBUTE = "social_login_frontend_redirect";
    private final HttpSessionOAuth2AuthorizationRequestRepository delegate =
        new HttpSessionOAuth2AuthorizationRequestRepository();

    @Override
    public OAuth2AuthorizationRequest loadAuthorizationRequest(HttpServletRequest request) {
        return delegate.loadAuthorizationRequest(request);
    }

    @Override
    public void saveAuthorizationRequest(
        OAuth2AuthorizationRequest authorizationRequest,
        HttpServletRequest request,
        HttpServletResponse response
    ) {
        delegate.saveAuthorizationRequest(authorizationRequest, request, response);
    }

    @Override
    public OAuth2AuthorizationRequest removeAuthorizationRequest(
        HttpServletRequest request,
        HttpServletResponse response
    ) {
        OAuth2AuthorizationRequest authorizationRequest =
            delegate.removeAuthorizationRequest(request, response);
        if (authorizationRequest != null) {
            Object redirect = authorizationRequest.getAttributes()
                .get(FrontendAuthorizationRequestResolver.REDIRECT_ATTRIBUTE);
            if (redirect instanceof String path) {
                request.setAttribute(REQUEST_REDIRECT_ATTRIBUTE, path);
            }
        }
        return authorizationRequest;
    }
}
