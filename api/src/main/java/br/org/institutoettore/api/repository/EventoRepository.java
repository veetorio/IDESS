package br.org.institutoettore.api.repository;

import br.org.institutoettore.api.domain.Evento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface EventoRepository extends JpaRepository<Evento, UUID> {
    Page<Evento> findByAberto(Boolean aberto, Pageable pageable);

    @Query(value = "SELECT * FROM eventos WHERE id = :id FOR UPDATE", nativeQuery = true)
    Optional<Evento> findByIdParaAtualizar(@Param("id") UUID id);
}
