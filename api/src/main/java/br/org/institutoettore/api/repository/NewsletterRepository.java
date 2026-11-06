package br.org.institutoettore.api.repository;

import br.org.institutoettore.api.domain.Newsletter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NewsletterRepository extends JpaRepository<Newsletter, UUID> {
    List<Newsletter> findAllByOrderByPublicadoEmDesc();
}
