package br.org.institutoettore.api.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "tickets_login_social")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketLoginSocial {
    @Id
    @Column(name = "token_hash", length = 64)
    private String tokenHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProvedorSocial provedor;

    @Column(nullable = false, length = 255)
    private String subject;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(name = "email_verificado", nullable = false)
    private boolean emailVerificado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conta_id")
    private Conta conta;

    @Column(name = "expira_em", nullable = false)
    private Instant expiraEm;
}
