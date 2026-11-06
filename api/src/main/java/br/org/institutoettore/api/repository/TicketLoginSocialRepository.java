package br.org.institutoettore.api.repository;

import br.org.institutoettore.api.domain.TicketLoginSocial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;

public interface TicketLoginSocialRepository extends JpaRepository<TicketLoginSocial, String> {
    void deleteAllByExpiraEmBefore(Instant instante);
}
