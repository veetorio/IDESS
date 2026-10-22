package br.org.institutoettore.api.controller;

import br.org.institutoettore.api.domain.Conta;
import br.org.institutoettore.api.dto.inscricao.InscricaoRequest;
import br.org.institutoettore.api.dto.inscricao.InscricaoResponse;
import br.org.institutoettore.api.service.InscricaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/inscricoes")
public class InscricaoController {
    private final InscricaoService inscricaoService;

    public InscricaoController(InscricaoService inscricaoService) {
        this.inscricaoService = inscricaoService;
    }

    @GetMapping
    public List<InscricaoResponse> minhasInscricoes(@AuthenticationPrincipal Conta conta) {
        return inscricaoService.listarDaConta(conta.getId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InscricaoResponse inscrever(
        @AuthenticationPrincipal Conta conta,
        @Valid @RequestBody InscricaoRequest request
    ) {
        return inscricaoService.inscrever(conta, request);
    }
}
