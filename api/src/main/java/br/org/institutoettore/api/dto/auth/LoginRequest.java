package br.org.institutoettore.api.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
    @Email(message = "E-mail inválido")
    @NotBlank(message = "E-mail é obrigatório")
    @Size(max = 255, message = "E-mail muito longo")
    String email,

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 1, max = 72, message = "Senha inválida")
    String senha
) {}
