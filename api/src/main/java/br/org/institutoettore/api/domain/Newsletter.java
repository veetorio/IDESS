package br.org.institutoettore.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "newsletters")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Newsletter {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(nullable = false, length = 300)
    private String resumo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String conteudo;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private Instant criadoEm = Instant.now();

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private Instant publicadoEm = Instant.now();
}
