package br.org.institutoettore.api.service;

import br.org.institutoettore.api.domain.Evento;
import br.org.institutoettore.api.domain.Projeto;
import br.org.institutoettore.api.dto.evento.EventoResponse;
import br.org.institutoettore.api.dto.projeto.ProjetoRequest;
import br.org.institutoettore.api.dto.projeto.ProjetoResponse;
import br.org.institutoettore.api.exception.RecursoNaoEncontradoException;
import br.org.institutoettore.api.exception.RequisicaoInvalidaException;
import br.org.institutoettore.api.repository.EventoRepository;
import br.org.institutoettore.api.repository.ProjetoRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ProjetoService {
    private static final ZoneId FUSO_INSTITUTO = ZoneId.of("America/Sao_Paulo");
    private static final int MINIMO_FOTOS = 4;

    private final ProjetoRepository projetoRepository;
    private final EventoRepository eventoRepository;
    private final ProjetoArquivoStorageService arquivoStorage;
    private final DtoMapper dtoMapper;

    public ProjetoService(
        ProjetoRepository projetoRepository,
        EventoRepository eventoRepository,
        ProjetoArquivoStorageService arquivoStorage,
        DtoMapper dtoMapper
    ) {
        this.projetoRepository = projetoRepository;
        this.eventoRepository = eventoRepository;
        this.arquivoStorage = arquivoStorage;
        this.dtoMapper = dtoMapper;
    }

    @Transactional(readOnly = true)
    public List<ProjetoResponse> listar() {
        return projetoRepository.findAll(Sort.by(Sort.Direction.DESC, "criadoEm"))
            .stream()
            .map(this::paraResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public ProjetoResponse buscar(UUID id) {
        return paraResponse(projetoRepository.findById(id)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Projeto não encontrado.")));
    }

    @Transactional
    public ProjetoResponse criar(
        ProjetoRequest request,
        MultipartFile logo,
        List<MultipartFile> fotos
    ) {
        validarFotos(fotos);
        Projeto projeto = Projeto.builder()
            .nome(request.nome().trim())
            .descricao(request.descricao().trim())
            .participantes(request.participantes())
            .logo(arquivoStorage.armazenarLogo(logo))
            .fotos(new ArrayList<>(arquivoStorage.armazenarFotos(fotos)))
            .build();
        return paraResponse(projetoRepository.save(projeto));
    }

    @Transactional
    public ProjetoResponse atualizar(
        UUID id,
        ProjetoRequest request,
        MultipartFile logo,
        List<MultipartFile> fotos
    ) {
        Projeto projeto = projetoRepository.findById(id)
            .orElseThrow(() -> new RecursoNaoEncontradoException("Projeto não encontrado."));
        if (fotos != null && !fotos.isEmpty()) validarFotos(fotos);
        projeto.setNome(request.nome().trim());
        projeto.setDescricao(request.descricao().trim());
        projeto.setParticipantes(request.participantes());
        if (logo != null && !logo.isEmpty()) {
            projeto.setLogo(arquivoStorage.armazenarLogo(logo));
        }
        if (fotos != null && !fotos.isEmpty()) {
            projeto.setFotos(new ArrayList<>(arquivoStorage.armazenarFotos(fotos)));
        }
        return paraResponse(projeto);
    }

    @Transactional
    public void excluir(UUID id) {
        if (!projetoRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Projeto não encontrado.");
        }
        projetoRepository.deleteById(id);
    }

    private void validarFotos(List<MultipartFile> fotos) {
        if (fotos == null || fotos.size() < MINIMO_FOTOS) {
            throw new RequisicaoInvalidaException(
                "O projeto deve ter pelo menos 4 fotos."
            );
        }
    }

    private ProjetoResponse paraResponse(Projeto projeto) {
        List<Evento> eventos =
            eventoRepository.findByProjetoIdOrderByDataInicioDescCriadoEmDesc(projeto.getId());
        Evento ultimoEvento = eventos.isEmpty() ? null : eventos.get(0);
        return new ProjetoResponse(
            projeto.getId(),
            projeto.getNome(),
            projeto.getDescricao(),
            projeto.getParticipantes(),
            projeto.getLogo(),
            List.copyOf(projeto.getFotos()),
            projeto.getCriadoEm(),
            calcularStatus(eventos, LocalDate.now(FUSO_INSTITUTO)),
            ultimoEvento == null ? null : dtoMapper.paraEventoResponse(ultimoEvento)
        );
    }

    private String calcularStatus(List<Evento> eventos, LocalDate hoje) {
        if (eventos.isEmpty()) return "SEM_EVENTOS";
        if (eventos.stream().anyMatch(evento ->
            !hoje.isBefore(evento.getDataInicio()) && !hoje.isAfter(evento.getDataFim()))) {
            return "EM_ANDAMENTO";
        }
        if (eventos.stream().anyMatch(evento -> evento.getDataInicio().isAfter(hoje))) {
            return "AGENDADO";
        }
        return "REALIZADO";
    }
}
