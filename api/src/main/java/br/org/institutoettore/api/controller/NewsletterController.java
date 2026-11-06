package br.org.institutoettore.api.controller;

import br.org.institutoettore.api.domain.Conta;
import br.org.institutoettore.api.dto.newsletter.NewsletterPreferenceRequest;
import br.org.institutoettore.api.dto.newsletter.NewsletterPreferenceResponse;
import br.org.institutoettore.api.dto.newsletter.NewsletterPublicationResponse;
import br.org.institutoettore.api.dto.newsletter.NewsletterRequest;
import br.org.institutoettore.api.dto.newsletter.NewsletterResponse;
import br.org.institutoettore.api.service.NewsletterService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/newsletter")
public class NewsletterController {
    private final NewsletterService newsletterService;

    public NewsletterController(NewsletterService newsletterService) {
        this.newsletterService = newsletterService;
    }

    @GetMapping
    public List<NewsletterResponse> listarPublicadas() {
        return newsletterService.listarPublicadas();
    }

    @GetMapping("/preferencia")
    public NewsletterPreferenceResponse minhaPreferencia(
        @AuthenticationPrincipal Conta conta
    ) {
        return newsletterService.buscarPreferencia(conta);
    }

    @PutMapping("/preferencia")
    public NewsletterPreferenceResponse atualizarPreferencia(
        @AuthenticationPrincipal Conta conta,
        @Valid @RequestBody NewsletterPreferenceRequest request
    ) {
        return newsletterService.atualizarPreferencia(conta, request);
    }

    @GetMapping("/admin")
    public List<NewsletterResponse> listarParaAdministracao() {
        return newsletterService.listarParaAdministracao();
    }

    @PostMapping("/admin")
    @ResponseStatus(HttpStatus.CREATED)
    public NewsletterPublicationResponse publicar(
        @Valid @RequestBody NewsletterRequest request
    ) {
        NewsletterResponse newsletter = newsletterService.publicar(request);
        NewsletterService.NewsletterPublicationResult envio =
            newsletterService.notificarInscritos(newsletter);
        return new NewsletterPublicationResponse(
            newsletter,
            envio.emailsEnviados(),
            envio.emailsFalhos(),
            envio.envioConfigurado()
        );
    }
}
