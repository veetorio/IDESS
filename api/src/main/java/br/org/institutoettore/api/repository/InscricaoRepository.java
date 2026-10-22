package br.org.institutoettore.api.repository;

import br.org.institutoettore.api.domain.Inscricao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InscricaoRepository extends JpaRepository<Inscricao, UUID> {

    boolean existsByInscritoIdAndEventoId(UUID inscritoId, UUID eventoId);

    List<Inscricao> findByInscritoId(UUID inscritoId);

    @Query("SELECT i FROM Inscricao i JOIN FETCH i.evento WHERE i.inscrito.id = :inscritoId")
    List<Inscricao> findByInscritoIdComEvento(@Param("inscritoId") UUID inscritoId);

    Optional<Inscricao> findByInscritoIdAndEventoId(UUID inscritoId, UUID eventoId);
}
