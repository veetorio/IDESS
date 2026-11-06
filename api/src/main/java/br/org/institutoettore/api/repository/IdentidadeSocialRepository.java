package br.org.institutoettore.api.repository;

import br.org.institutoettore.api.domain.IdentidadeSocial;
import br.org.institutoettore.api.domain.ProvedorSocial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface IdentidadeSocialRepository extends JpaRepository<IdentidadeSocial, UUID> {
    Optional<IdentidadeSocial> findByProvedorAndSubject(
        ProvedorSocial provedor,
        String subject
    );

    boolean existsByContaIdAndProvedor(UUID contaId, ProvedorSocial provedor);
}
