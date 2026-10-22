package br.org.institutoettore.api.domain;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "contas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conta implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Nome é obrigatório")
    @Column(nullable = false, length = 100)
    private String nome;

    @Valid
    @Embedded
    private Contato contato;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 60, max = 60, message = "Senha deve estar encriptada (BCrypt)")
    @Column(nullable = false, length = 60)
    private String senha;

    @Column(nullable = false)
    @Builder.Default
    private Boolean atividade = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Role role = Role.COMMON;

    @OneToMany(mappedBy = "inscrito", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Inscricao> inscricoes = List.of();

    // ---- UserDetails ----

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return senha;
    }

    @Override
    public String getUsername() {
        return contato.getEmail();
    }

    @Override
    public boolean isEnabled() {
        return Boolean.TRUE.equals(atividade);
    }
}
