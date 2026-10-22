package br.org.institutoettore.api.dto.auth;

import jakarta.validation.constraints.*;

public record RegisterRequest(
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 3, max = 100)
    String nome,

    @Email(message = "E-mail inválido")
    @NotBlank(message = "E-mail é obrigatório")
    @Size(max = 255, message = "E-mail muito longo")
    String email,

    @NotBlank(message = "Telefone é obrigatório")
    @Size(min = 10, max = 40, message = "Telefone inválido")
    @Pattern(regexp = "^[\\d\\s()\\-+]+$", message = "Telefone inválido")
    String telefone,

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, max = 72, message = "Senha deve ter entre 6 e 72 caracteres")
    String senha
) {}
