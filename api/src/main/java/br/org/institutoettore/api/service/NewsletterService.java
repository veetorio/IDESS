package br.org.institutoettore.api.service;

import br.org.institutoettore.api.domain.Conta;
import br.org.institutoettore.api.domain.Newsletter;
import br.org.institutoettore.api.domain.Role;
import br.org.institutoettore.api.dto.newsletter.NewsletterPreferenceRequest;
import br.org.institutoettore.api.dto.newsletter.NewsletterPreferenceResponse;
import br.org.institutoettore.api.dto.newsletter.NewsletterRequest;
import br.org.institutoettore.api.dto.newsletter.NewsletterResponse;
import br.org.institutoettore.api.repository.ContaRepository;
import br.org.institutoettore.api.repository.NewsletterRepository;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NewsletterService {
    private final NewsletterRepository newsletterRepository;
    private final ContaRepository contaRepository;
    private final ObjectProvider<NewsletterEmailDispatcher> emailDispatcherProvider;

    public NewsletterService(
        NewsletterRepository newsletterRepository,
        ContaRepository contaRepository,
        ObjectProvider<NewsletterEmailDispatcher> emailDispatcherProvider
    ) {
        this.newsletterRepository = newsletterRepository;
        this.contaRepository = contaRepository;
        this.emailDispatcherProvider = emailDispatcherProvider;
    }

    @Transactional(readOnly = true)
    public List<NewsletterResponse> listarPublicadas() {
        return newsletterRepository.findAllByOrderByPublicadoEmDesc()
            .stream()
            .map(this::paraResposta)
            .toList();
    }

    @Transactional(readOnly = true)
    public NewsletterPreferenceResponse buscarPreferencia(Conta conta) {
        return new NewsletterPreferenceResponse(
            conta.getContato().getEmail(),
            Boolean.TRUE.equals(conta.getRecebeNewsletter())
        );
    }

    @Transactional
    public NewsletterPreferenceResponse atualizarPreferencia(
        Conta conta,
        NewsletterPreferenceRequest request
    ) {
        conta.setRecebeNewsletter(request.recebeNewsletter());
        Conta contaAtualizada = contaRepository.save(conta);
        return buscarPreferencia(contaAtualizada);
    }

    @Transactional(readOnly = true)
    public List<NewsletterResponse> listarParaAdministracao() {
        return newsletterRepository.findAllByOrderByPublicadoEmDesc()
            .stream()
            .map(this::paraResposta)
            .toList();
    }

    @Transactional
    public NewsletterResponse publicar(NewsletterRequest request) {
        Newsletter newsletter = Newsletter.builder()
            .titulo(request.titulo().trim())
            .resumo(request.resumo().trim())
            .conteudo(request.conteudo().trim())
            .build();
        return paraResposta(newsletterRepository.save(newsletter));
    }

    public NewsletterPublicationResult notificarInscritos(NewsletterResponse publicada) {
        NewsletterEmailDispatcher dispatcher = emailDispatcherProvider.getIfAvailable();
        if (dispatcher == null) {
            return new NewsletterPublicationResult(0, 0, false);
        }

        Newsletter newsletter = newsletterRepository.findById(publicada.id())
            .orElseThrow(() -> new IllegalStateException("Newsletter publicada não encontrada."));
        List<String> destinatarios = contaRepository
            .findByAtividadeTrueAndRoleAndRecebeNewsletterTrue(Role.COMMON)
            .stream()
            .map(conta -> conta.getContato().getEmail())
            .toList();
        NewsletterEmailDispatcher.ResultadoEnvio resultado =
            dispatcher.enviar(newsletter, destinatarios);
        return new NewsletterPublicationResult(
            resultado.enviados(),
            resultado.falhos(),
            true
        );
    }

    private NewsletterResponse paraResposta(Newsletter newsletter) {
        return new NewsletterResponse(
            newsletter.getId(),
            newsletter.getTitulo(),
            newsletter.getResumo(),
            newsletter.getConteudo(),
            newsletter.getCriadoEm(),
            newsletter.getPublicadoEm()
        );
    }

    public record NewsletterPublicationResult(
        int emailsEnviados,
        int emailsFalhos,
        boolean envioConfigurado
    ) {}
}
