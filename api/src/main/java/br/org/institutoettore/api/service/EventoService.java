package br.org.institutoettore.api.service;

import br.org.institutoettore.api.domain.Evento;
import br.org.institutoettore.api.dto.PaginaResponse;
import br.org.institutoettore.api.dto.evento.EventoRequest;
import br.org.institutoettore.api.dto.evento.EventoResponse;
import br.org.institutoettore.api.exception.RequisicaoInvalidaException;
import br.org.institutoettore.api.exception.RecursoNaoEncontradoException;
import br.org.institutoettore.api.repository.EventoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class EventoService {
    private final EventoRepository eventoRepository;
    private final DtoMapper dtoMapper;

    public EventoService(EventoRepository eventoRepository, DtoMapper dtoMapper) {
        this.eventoRepository = eventoRepository;
        this.dtoMapper = dtoMapper;
    }

    @Transactional(readOnly = true)
    public PaginaResponse<EventoResponse> listar(
        int pagina,
        int tamanho,
        Boolean aberto
    ) {
        PageRequest paginacao = PageRequest.of(
            pagina,
            tamanho,
            Sort.by(Sort.Direction.DESC, "criadoEm")
        );
        Page<Evento> eventos = aberto == null
            ? eventoRepository.findAll(paginacao)
            : eventoRepository.findByAberto(aberto, paginacao);
        return PaginaResponse.de(eventos.map(dtoMapper::paraEventoResponse));
    }

    @Transactional(readOnly = true)
    public EventoResponse buscar(UUID id) {
        return eventoRepository.findById(id)
            .map(dtoMapper::paraEventoResponse)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Evento não encontrado."));
    }

    @Transactional
    public EventoResponse criar(EventoRequest request) {
        validarImagens(request.imgs());
        Evento evento = Evento.builder()
            .nome(request.nome().trim())
            .descricao(request.descricao().trim())
            .imgs(imagens(request.imgs()))
            .vagasTotais(request.vagasTotais())
            .vagasOcupadas(0)
            .aberto(request.aberto() == null || request.aberto())
            .build();
        return dtoMapper.paraEventoResponse(eventoRepository.save(evento));
    }

    @Transactional
    public EventoResponse atualizar(UUID id, EventoRequest request) {
        validarImagens(request.imgs());
        Evento evento = eventoRepository.findByIdParaAtualizar(id)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Evento não encontrado."));
        if (request.vagasTotais() < evento.getVagasOcupadas()) {
            throw new RequisicaoInvalidaException(
                "O total de vagas não pode ser menor que a quantidade de inscrições."
            );
        }
        evento.setNome(request.nome().trim());
        evento.setDescricao(request.descricao().trim());
        evento.setImgs(imagens(request.imgs()));
        evento.setVagasTotais(request.vagasTotais());
        evento.setAberto(request.aberto() == null || request.aberto());
        return dtoMapper.paraEventoResponse(evento);
    }

    private List<String> imagens(List<String> imagens) {
        return imagens == null ? new ArrayList<>() : new ArrayList<>(imagens);
    }

    private void validarImagens(List<String> imagens) {
        if (imagens == null) return;
        for (String imagem : imagens) {
            try {
                URI uri = URI.create(imagem);
                boolean caminhoLocal = imagem.startsWith("/") && !imagem.startsWith("//");
                boolean urlHttp = uri.isAbsolute()
                    && ("http".equalsIgnoreCase(uri.getScheme())
                        || "https".equalsIgnoreCase(uri.getScheme()))
                    && uri.getHost() != null;
                if (!caminhoLocal && !urlHttp) {
                    throw new IllegalArgumentException();
                }
            } catch (IllegalArgumentException exception) {
                throw new RequisicaoInvalidaException(
                    "Cada imagem deve ser uma URL HTTP(S) ou um caminho local válido."
                );
            }
        }
    }
}
