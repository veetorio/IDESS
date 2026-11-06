package br.org.institutoettore.api.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TrocaTicketSocialRequest(
    @NotBlank(message = "Ticket de autenticação inválido")
    @Size(max = 128, message = "Ticket de autenticação inválido")
    String ticket,

    @Size(max = 40, message = "Telefone muito longo")
    String telefone
) {}
