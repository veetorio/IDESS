package br.org.institutoettore.api.controller;

import br.org.institutoettore.api.dto.auth.AuthResponse;
import br.org.institutoettore.api.dto.auth.TrocaTicketSocialRequest;
import br.org.institutoettore.api.service.LoginSocialService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/social")
public class LoginSocialController {
    private final LoginSocialService loginSocialService;

    public LoginSocialController(LoginSocialService loginSocialService) {
        this.loginSocialService = loginSocialService;
    }

    @PostMapping("/exchange")
    public AuthResponse trocarTicket(@Valid @RequestBody TrocaTicketSocialRequest request) {
        return loginSocialService.trocarTicket(request);
    }
}
