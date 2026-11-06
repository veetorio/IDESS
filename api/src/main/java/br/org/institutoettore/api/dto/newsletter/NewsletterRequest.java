package br.org.institutoettore.api.dto.newsletter;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NewsletterRequest(
    @NotBlank(message = "O título é obrigatório.")
    @Size(max = 150, message = "O título deve ter no máximo 150 caracteres.")
    String titulo,

    @NotBlank(message = "O resumo é obrigatório.")
    @Size(max = 300, message = "O resumo deve ter no máximo 300 caracteres.")
    String resumo,

    @NotBlank(message = "O conteúdo é obrigatório.")
    @Size(max = 20000, message = "O conteúdo deve ter no máximo 20000 caracteres.")
    String conteudo
) {}
