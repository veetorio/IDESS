package br.org.institutoettore.api.service;

import br.org.institutoettore.api.config.JwtService;
import br.org.institutoettore.api.domain.Conta;
import br.org.institutoettore.api.domain.Contato;
import br.org.institutoettore.api.domain.Role;
import br.org.institutoettore.api.dto.auth.AuthResponse;
import br.org.institutoettore.api.dto.auth.LoginRequest;
import br.org.institutoettore.api.dto.auth.RegisterRequest;
import br.org.institutoettore.api.dto.conta.ContaResponse;
import br.org.institutoettore.api.exception.ConflitoException;
import br.org.institutoettore.api.exception.RequisicaoInvalidaException;
import br.org.institutoettore.api.repository.ContaRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.nio.charset.StandardCharsets;

@Service
public class AuthService {
    private final ContaRepository contaRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final DtoMapper dtoMapper;

    public AuthService(
        ContaRepository contaRepository,
        PasswordEncoder passwordEncoder,
        AuthenticationManager authenticationManager,
        JwtService jwtService,
        DtoMapper dtoMapper
    ) {
        this.contaRepository = contaRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.dtoMapper = dtoMapper;
    }

    @Transactional
    public ContaResponse registrar(RegisterRequest request) {
        validarTamanhoSenha(request.senha());
        String email = normalizarEmail(request.email());
        if (contaRepository.existsByContatoEmail(email)) {
            throw new ConflitoException("Este e-mail já está cadastrado.");
        }

        Conta conta = Conta.builder()
            .nome(request.nome().trim())
            .contato(new Contato(email, request.telefone().trim()))
            .senha(passwordEncoder.encode(request.senha()))
            .atividade(true)
            .role(Role.COMMON)
            .build();
        return dtoMapper.paraContaResponse(contaRepository.save(conta));
    }

    @Transactional(readOnly = true)
    public AuthResponse autenticar(LoginRequest request) {
        if (request.senha().getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new org.springframework.security.authentication.BadCredentialsException(
                "Credenciais inválidas."
            );
        }
        String email = normalizarEmail(request.email());
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(email, request.senha())
        );
        Conta conta = contaRepository.findByContatoEmail(email)
            .orElseThrow(() -> new IllegalStateException("Conta autenticada não encontrada."));
        return new AuthResponse(jwtService.gerarToken(conta), dtoMapper.paraContaResponse(conta));
    }

    private String normalizarEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private void validarTamanhoSenha(String senha) {
        if (senha.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new RequisicaoInvalidaException(
                "A senha não pode exceder 72 bytes em UTF-8."
            );
        }
    }
}
