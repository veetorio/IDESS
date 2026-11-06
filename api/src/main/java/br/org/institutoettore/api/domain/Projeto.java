package br.org.institutoettore.api.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "projetos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Projeto {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank
    @Size(max = 150)
    @Column(nullable = false, length = 150)
    private String nome;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Min(0)
    @Column(nullable = false)
    private Integer participantes;

    @NotBlank
    @Column(nullable = false, length = 2048)
    private String logo;

    @ElementCollection
    @CollectionTable(name = "projeto_fotos", joinColumns = @JoinColumn(name = "projeto_id"))
    @Column(name = "foto_path", nullable = false, length = 2048)
    @OrderColumn(name = "ordem")
    @Builder.Default
    private List<String> fotos = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private Instant criadoEm = Instant.now();

    @OneToMany(mappedBy = "projeto", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Evento> eventos = new ArrayList<>();
}
