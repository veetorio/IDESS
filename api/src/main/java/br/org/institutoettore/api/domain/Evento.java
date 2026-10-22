package br.org.institutoettore.api.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "eventos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Nome do evento é obrigatório")
    @Size(max = 150)
    @Column(nullable = false)
    private String nome;

    @NotBlank(message = "Descrição é obrigatória")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    /**
     * Caminhos/URLs das imagens do evento.
     * Armazenados como array nativo do PostgreSQL.
     */
    @ElementCollection
    @CollectionTable(name = "evento_imgs", joinColumns = @JoinColumn(name = "evento_id"))
    @Column(name = "img_path", length = 2048)
    @OrderColumn(name = "ordem")
    @Builder.Default
    private List<String> imgs = new ArrayList<>();

    @Min(value = 0, message = "Vagas ocupadas não pode ser negativo")
    @Column(nullable = false)
    @Builder.Default
    private Integer vagasOcupadas = 0;

    @Min(value = 1, message = "Vagas totais deve ser pelo menos 1")
    @Column(nullable = false)
    private Integer vagasTotais;

    @Column(nullable = false)
    @Builder.Default
    private Boolean aberto = true;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private Instant criadoEm = Instant.now();

    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Inscricao> inscritos = new ArrayList<>();
}
