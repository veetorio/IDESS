package br.org.institutoettore.api.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "inscricoes",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_inscricao_conta_evento",
        columnNames = {"inscrito_id", "evento_id"}
    )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inscricao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "inscrito_id", nullable = false)
    private Conta inscrito;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private Instant criadoEm = Instant.now();
}
