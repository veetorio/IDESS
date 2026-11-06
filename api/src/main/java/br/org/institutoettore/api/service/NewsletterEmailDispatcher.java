package br.org.institutoettore.api.service;

import br.org.institutoettore.api.domain.Newsletter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConditionalOnProperty(name = "app.newsletter.email.enabled", havingValue = "true")
public class NewsletterEmailDispatcher {
    private static final Logger LOGGER =
        LoggerFactory.getLogger(NewsletterEmailDispatcher.class);

    private final JavaMailSender mailSender;
    private final String remetente;

    public NewsletterEmailDispatcher(
        JavaMailSender mailSender,
        @Value("${spring.mail.host}") String host,
        @Value("${app.newsletter.email.from}") String remetente
    ) {
        if (host.isBlank()) {
            throw new IllegalStateException(
                "NEWSLETTER_SMTP_HOST deve ser definido quando o envio de e-mail está habilitado."
            );
        }
        if (remetente.isBlank()) {
            throw new IllegalStateException(
                "NEWSLETTER_EMAIL_FROM deve ser definido quando o envio de e-mail está habilitado."
            );
        }
        this.mailSender = mailSender;
        this.remetente = remetente;
    }

    public ResultadoEnvio enviar(Newsletter newsletter, List<String> destinatarios) {
        int enviados = 0;
        int falhos = 0;
        for (String destinatario : destinatarios) {
            SimpleMailMessage mensagem = new SimpleMailMessage();
            mensagem.setFrom(remetente);
            mensagem.setTo(destinatario);
            mensagem.setSubject(newsletter.getTitulo());
            mensagem.setText("""
                %s

                %s

                %s

                Você recebeu esta mensagem porque optou por receber novidades do Instituto.
                Altere sua preferência em Minha Conta no site do Instituto.
                """.formatted(
                    newsletter.getTitulo(),
                    newsletter.getResumo(),
                    newsletter.getConteudo()
                ));
            try {
                mailSender.send(mensagem);
                enviados++;
            } catch (MailException erro) {
                falhos++;
                LOGGER.error(
                    "Falha ao enviar newsletter {}; um destinatário não recebeu a mensagem.",
                    newsletter.getId(),
                    erro
                );
            }
        }
        return new ResultadoEnvio(enviados, falhos);
    }

    public record ResultadoEnvio(int enviados, int falhos) {}
}
