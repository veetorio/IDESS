package br.org.institutoettore.api.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(
    name = "contas_identidades_sociais",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_identidade_social_provedor_subject",
            columnNames = {"provedor", "subject"}
        ),
        @UniqueConstraint(
            name = "uk_identidade_social_conta_provedor",
            columnNames = {"conta_id", "provedor"}
        )
    }
)
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IdentidadeSocial {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "conta_id", nullable = false)
    private Conta conta;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProvedorSocial provedor;

    @Column(nullable = false, length = 255)
    private String subject;
}
