package br.org.institutoettore.api.repository;

import br.org.institutoettore.api.domain.Conta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ContaRepository extends JpaRepository<Conta, UUID> {
    Optional<Conta> findByContatoEmail(String email);
    boolean existsByContatoEmail(String email);
}
