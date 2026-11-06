package br.org.institutoettore.api.dto.projeto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProjetoRequest(
    @NotBlank(message = "Nome do projeto é obrigatório")
    @Size(max = 150)
    String nome,

    @NotBlank(message = "Descrição é obrigatória")
    String descricao,

    @NotNull(message = "A quantidade de participantes é obrigatória")
    @Min(value = 0, message = "A quantidade de participantes não pode ser negativa")
    Integer participantes
) {}
