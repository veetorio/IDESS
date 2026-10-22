package br.org.institutoettore.api.controller;

import br.org.institutoettore.api.dto.auth.AuthResponse;
import br.org.institutoettore.api.dto.auth.LoginRequest;
import br.org.institutoettore.api.dto.auth.RegisterRequest;
import br.org.institutoettore.api.dto.conta.ContaResponse;
import br.org.institutoettore.api.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ContaResponse registrar(@Valid @RequestBody RegisterRequest request) {
        return authService.registrar(request);
    }

    @PostMapping("/login")
    public AuthResponse autenticar(@Valid @RequestBody LoginRequest request) {
        return authService.autenticar(request);
    }
}
