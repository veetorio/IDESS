package br.org.institutoettore.api.controller;

import br.org.institutoettore.api.dto.PaginaResponse;
import br.org.institutoettore.api.dto.evento.EventoRequest;
import br.org.institutoettore.api.dto.evento.EventoResponse;
import br.org.institutoettore.api.service.EventoImagemStorageService;
import br.org.institutoettore.api.service.EventoService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Validated
@RestController
@RequestMapping("/eventos")
public class EventoController {
    private final EventoService eventoService;
    private final EventoImagemStorageService imagemStorageService;

    public EventoController(
        EventoService eventoService,
        EventoImagemStorageService imagemStorageService
    ) {
        this.eventoService = eventoService;
        this.imagemStorageService = imagemStorageService;
    }

    @GetMapping
    public PaginaResponse<EventoResponse> listar(
        @RequestParam(defaultValue = "0") @Min(0) int page,
        @RequestParam(defaultValue = "9") @Min(1) @Max(100) int size,
        @RequestParam(required = false) Boolean aberto
    ) {
        return eventoService.listar(page, size, aberto);
    }

    @GetMapping("/{id}")
    public EventoResponse buscar(@PathVariable UUID id) {
        return eventoService.buscar(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public EventoResponse criarComImagens(
        @Valid @RequestPart("evento") EventoRequest request,
        @RequestPart(value = "imagens", required = false) List<MultipartFile> imagens
    ) {
        List<String> caminhos = imagemStorageService.armazenar(imagens);
        EventoRequest evento = new EventoRequest(
            request.nome(),
            request.descricao(),
            caminhos,
            request.vagasTotais(),
            request.aberto()
        );
        return eventoService.criar(evento);
    }

    @PutMapping("/{id}")
    public EventoResponse atualizar(
        @PathVariable UUID id,
        @Valid @RequestBody EventoRequest request
    ) {
        return eventoService.atualizar(id, request);
    }
}
