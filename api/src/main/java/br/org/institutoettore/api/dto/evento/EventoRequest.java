package br.org.institutoettore.api.dto.evento;

import jakarta.validation.constraints.*;

import java.util.List;

public record EventoRequest(
    @NotBlank(message = "Nome do evento é obrigatório")
    @Size(max = 150)
    String nome,

    @NotBlank(message = "Descrição é obrigatória")
    String descricao,

    @Size(max = 10, message = "O evento pode ter no máximo 10 imagens")
    List<@NotBlank @Size(max = 2048) String> imgs,

    @Min(value = 1, message = "Vagas totais deve ser pelo menos 1")
    @NotNull(message = "Vagas totais é obrigatório")
    Integer vagasTotais,

    Boolean aberto
) {}
