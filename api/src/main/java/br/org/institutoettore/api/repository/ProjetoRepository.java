package br.org.institutoettore.api.repository;

import br.org.institutoettore.api.domain.Projeto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProjetoRepository extends JpaRepository<Projeto, UUID> {}
