package br.org.institutoettore.api.service;

import br.org.institutoettore.api.config.JwtService;
import br.org.institutoettore.api.domain.Conta;
import br.org.institutoettore.api.domain.Contato;
import br.org.institutoettore.api.domain.IdentidadeSocial;
import br.org.institutoettore.api.domain.ProvedorSocial;
import br.org.institutoettore.api.domain.Role;
import br.org.institutoettore.api.domain.TicketLoginSocial;
import br.org.institutoettore.api.dto.auth.AuthResponse;
import br.org.institutoettore.api.dto.auth.TicketSocialResponse;
import br.org.institutoettore.api.dto.auth.TrocaTicketSocialRequest;
import br.org.institutoettore.api.exception.ConflitoException;
import br.org.institutoettore.api.exception.RequisicaoInvalidaException;
import br.org.institutoettore.api.repository.ContaRepository;
import br.org.institutoettore.api.repository.IdentidadeSocialRepository;
import br.org.institutoettore.api.repository.TicketLoginSocialRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Locale;
import java.util.UUID;

@Service
public class LoginSocialService {
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final long TICKET_VALIDADE_SEGUNDOS = 300;

    private final ContaRepository contaRepository;
    private final IdentidadeSocialRepository identidadeRepository;
    private final TicketLoginSocialRepository ticketRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final DtoMapper dtoMapper;

    public LoginSocialService(
        ContaRepository contaRepository,
        IdentidadeSocialRepository identidadeRepository,
        TicketLoginSocialRepository ticketRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService,
        DtoMapper dtoMapper
    ) {
        this.contaRepository = contaRepository;
        this.identidadeRepository = identidadeRepository;
        this.ticketRepository = ticketRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.dtoMapper = dtoMapper;
    }

    @Transactional
    public TicketSocialResponse criarTicket(
        ProvedorSocial provedor,
        String subject,
        String emailDoProvedor,
        String nomeDoProvedor,
        boolean emailVerificado
    ) {
        ticketRepository.deleteAllByExpiraEmBefore(Instant.now());
        if (subject == null || subject.isBlank() || subject.length() > 255) {
            throw new RequisicaoInvalidaException("Identidade social inválida.");
        }

        Conta conta = identidadeRepository.findByProvedorAndSubject(provedor, subject)
            .map(IdentidadeSocial::getConta)
            .orElse(null);

        String email = normalizarEmail(emailDoProvedor);
        if (conta != null) {
            email = emailValido(email) ? email : conta.getContato().getEmail();
            nomeDoProvedor = nomeValido(nomeDoProvedor) ? nomeDoProvedor : conta.getNome();
        } else {
            if (!emailValido(email)) {
                throw new RequisicaoInvalidaException(
                    "O provedor não retornou um e-mail válido para esta conta."
                );
            }
            conta = contaRepository.findByContatoEmail(email).orElse(null);
            if (conta != null && !emailVerificado) {
                throw new EmailSocialNaoVerificadoException();
            }
        }

        if (conta != null && !conta.isEnabled()) {
            throw new ConflitoException("Esta conta está desativada.");
        }

        String nome = nomeValido(nomeDoProvedor)
            ? nomeDoProvedor.trim()
            : email.substring(0, email.indexOf('@'));
        nome = nome.substring(0, Math.min(nome.length(), 100));

        String ticket = gerarTicket();
        ticketRepository.save(TicketLoginSocial.builder()
            .tokenHash(hashTicket(ticket))
            .provedor(provedor)
            .subject(subject)
            .email(email)
            .nome(nome)
            .emailVerificado(emailVerificado)
            .conta(conta)
            .expiraEm(Instant.now().plusSeconds(TICKET_VALIDADE_SEGUNDOS))
            .build());
        return new TicketSocialResponse(ticket, conta == null);
    }

    @Transactional
    public AuthResponse trocarTicket(TrocaTicketSocialRequest request) {
        if (request.ticket() == null || request.ticket().isBlank()) {
            throw new RequisicaoInvalidaException("Ticket de autenticação inválido.");
        }
        String tokenHash = hashTicket(request.ticket());
        TicketLoginSocial ticket = ticketRepository.findById(tokenHash)
            .filter(registro -> registro.getExpiraEm().isAfter(Instant.now()))
            .orElseThrow(() ->
                new RequisicaoInvalidaException("O ticket expirou ou já foi utilizado.")
            );

        Conta conta = ticket.getConta();
        if (conta == null) {
            conta = identidadeRepository
                .findByProvedorAndSubject(ticket.getProvedor(), ticket.getSubject())
                .map(IdentidadeSocial::getConta)
                .orElse(null);
        }
        if (conta == null) {
            conta = contaRepository.findByContatoEmail(ticket.getEmail()).orElse(null);
            if (conta != null && !ticket.isEmailVerificado()) {
                throw new EmailSocialNaoVerificadoException();
            }
        }
        if (conta == null) {
            String telefone = request.telefone() == null ? "" : request.telefone().trim();
            if (telefone.isBlank()) {
                throw new RequisicaoInvalidaException(
                    "Informe um telefone para concluir o cadastro."
                );
            }
            conta = contaRepository.save(Conta.builder()
                .nome(ticket.getNome())
                .contato(new Contato(ticket.getEmail(), telefone))
                .senha(passwordEncoder.encode(UUID.randomUUID().toString()))
                .atividade(true)
                .role(Role.COMMON)
                .build());
        }

        if (!conta.isEnabled()) {
            throw new ConflitoException("Esta conta está desativada.");
        }

        var identidadeExistente = identidadeRepository.findByProvedorAndSubject(
            ticket.getProvedor(),
            ticket.getSubject()
        );
        if (identidadeExistente.isPresent()) {
            if (!identidadeExistente.get().getConta().getId().equals(conta.getId())) {
                throw new ConflitoException("Esta identidade social já está vinculada a outra conta.");
            }
        } else {
            if (identidadeRepository.existsByContaIdAndProvedor(conta.getId(), ticket.getProvedor())) {
                throw new ConflitoException(
                    "Esta conta já possui uma identidade vinculada deste provedor."
                );
            }
            identidadeRepository.save(IdentidadeSocial.builder()
                .conta(conta)
                .provedor(ticket.getProvedor())
                .subject(ticket.getSubject())
                .build());
        }

        ticketRepository.delete(ticket);
        return new AuthResponse(jwtService.gerarToken(conta), dtoMapper.paraContaResponse(conta));
    }

    private String gerarTicket() {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hashTicket(String ticket) {
        try {
            byte[] hash = MessageDigest.getInstance("SHA-256")
                .digest(ticket.getBytes(StandardCharsets.UTF_8));
            return java.util.HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 não está disponível.", exception);
        }
    }

    private String normalizarEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
    }

    private boolean emailValido(String email) {
        return email.length() <= 255
            && email.indexOf('@') > 0
            && email.lastIndexOf('.') > email.indexOf('@') + 1;
    }

    private boolean nomeValido(String nome) {
        return nome != null && !nome.isBlank();
    }
}
