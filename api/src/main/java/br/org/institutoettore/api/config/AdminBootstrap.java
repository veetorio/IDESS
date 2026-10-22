package br.org.institutoettore.api.config;

import br.org.institutoettore.api.domain.Conta;
import br.org.institutoettore.api.domain.Contato;
import br.org.institutoettore.api.domain.Role;
import br.org.institutoettore.api.exception.RequisicaoInvalidaException;
import br.org.institutoettore.api.repository.ContaRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.nio.charset.StandardCharsets;

@Component
public class AdminBootstrap implements ApplicationRunner {
    private final ContaRepository contaRepository;
    private final PasswordEncoder passwordEncoder;
    private final String email;
    private final String senha;
    private final String nome;
    private final String telefone;

    public AdminBootstrap(
        ContaRepository contaRepository,
        PasswordEncoder passwordEncoder,
        @Value("${app.admin.email:}") String email,
        @Value("${app.admin.password:}") String senha,
        @Value("${app.admin.nome:Administrador}") String nome,
        @Value("${app.admin.telefone:}") String telefone
    ) {
        this.contaRepository = contaRepository;
        this.passwordEncoder = passwordEncoder;
        this.email = email.trim().toLowerCase(Locale.ROOT);
        this.senha = senha;
        this.nome = nome.trim();
        this.telefone = telefone.trim();
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (email.isEmpty()) return;
        if (senha.isBlank() || telefone.isBlank() || nome.isBlank()) {
            throw new IllegalStateException(
                "ADMIN_PASSWORD, ADMIN_PHONE e ADMIN_NAME são obrigatórios quando ADMIN_EMAIL está configurado."
            );
        }
        if (senha.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new IllegalStateException("ADMIN_PASSWORD não pode exceder 72 bytes em UTF-8.");
        }
        var contaExistente = contaRepository.findByContatoEmail(email);
        if (contaExistente.isPresent()) {
            if (contaExistente.get().getRole() != Role.ADMIN) {
                throw new IllegalStateException(
                    "ADMIN_EMAIL já pertence a uma conta sem permissões administrativas."
                );
            }
            return;
        }

        contaRepository.save(Conta.builder()
            .nome(nome)
            .contato(new Contato(email, telefone))
            .senha(passwordEncoder.encode(senha))
            .atividade(true)
            .role(Role.ADMIN)
            .build());
    }
}
