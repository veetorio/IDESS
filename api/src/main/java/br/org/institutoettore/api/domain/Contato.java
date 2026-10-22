package br.org.institutoettore.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Contato {

    @Email(message = "E-mail inválido")
    @NotBlank(message = "E-mail é obrigatório")
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Telefone é obrigatório")
    @Column(name = "telefone", nullable = false, length = 40)
    private String telefone;
}
