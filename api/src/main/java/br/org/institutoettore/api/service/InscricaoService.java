package br.org.institutoettore.api.service;

import br.org.institutoettore.api.domain.Conta;
import br.org.institutoettore.api.domain.Evento;
import br.org.institutoettore.api.domain.Inscricao;
import br.org.institutoettore.api.dto.inscricao.InscricaoRequest;
import br.org.institutoettore.api.dto.inscricao.InscricaoResponse;
import br.org.institutoettore.api.exception.ConflitoException;
import br.org.institutoettore.api.exception.RecursoNaoEncontradoException;
import br.org.institutoettore.api.repository.EventoRepository;
import br.org.institutoettore.api.repository.InscricaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class InscricaoService {
    private final InscricaoRepository inscricaoRepository;
    private final EventoRepository eventoRepository;
    private final DtoMapper dtoMapper;

    public InscricaoService(
        InscricaoRepository inscricaoRepository,
        EventoRepository eventoRepository,
        DtoMapper dtoMapper
    ) {
        this.inscricaoRepository = inscricaoRepository;
        this.eventoRepository = eventoRepository;
        this.dtoMapper = dtoMapper;
    }

    @Transactional(readOnly = true)
    public List<InscricaoResponse> listarDaConta(UUID contaId) {
        return inscricaoRepository.findByInscritoIdComEvento(contaId).stream()
            .map(dtoMapper::paraInscricaoResponse)
            .toList();
    }

    @Transactional
    public InscricaoResponse inscrever(Conta conta, InscricaoRequest request) {
        Evento evento = eventoRepository.findByIdParaAtualizar(request.eventoId())
            .orElseThrow(() -> new RecursoNaoEncontradoException("Evento não encontrado."));
        if (inscricaoRepository.existsByInscritoIdAndEventoId(conta.getId(), evento.getId())) {
            throw new ConflitoException("Você já está inscrito neste evento.");
        }
        if (!Boolean.TRUE.equals(evento.getAberto())) {
            throw new ConflitoException("As inscrições para este evento estão encerradas.");
        }
        if (evento.getVagasOcupadas() >= evento.getVagasTotais()) {
            throw new ConflitoException("Não há vagas disponíveis neste evento.");
        }

        Inscricao inscricao = Inscricao.builder()
            .inscrito(conta)
            .evento(evento)
            .build();
        evento.setVagasOcupadas(evento.getVagasOcupadas() + 1);
        return dtoMapper.paraInscricaoResponse(inscricaoRepository.save(inscricao));
    }
}
