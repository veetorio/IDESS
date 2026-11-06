package br.org.institutoettore.api.controller;

import br.org.institutoettore.api.dto.projeto.ProjetoRequest;
import br.org.institutoettore.api.dto.projeto.ProjetoResponse;
import br.org.institutoettore.api.service.ProjetoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/projetos")
public class ProjetoController {
    private final ProjetoService projetoService;

    public ProjetoController(ProjetoService projetoService) {
        this.projetoService = projetoService;
    }

    @GetMapping
    public List<ProjetoResponse> listar() {
        return projetoService.listar();
    }

    @GetMapping("/{id}")
    public ProjetoResponse buscar(@PathVariable UUID id) {
        return projetoService.buscar(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ProjetoResponse criar(
        @Valid @RequestPart("projeto") ProjetoRequest request,
        @RequestPart("logo") MultipartFile logo,
        @RequestPart("fotos") List<MultipartFile> fotos
    ) {
        return projetoService.criar(request, logo, fotos);
    }

    @PutMapping(path = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProjetoResponse atualizar(
        @PathVariable UUID id,
        @Valid @RequestPart("projeto") ProjetoRequest request,
        @RequestPart(value = "logo", required = false) MultipartFile logo,
        @RequestPart(value = "fotos", required = false) List<MultipartFile> fotos
    ) {
        return projetoService.atualizar(id, request, logo, fotos);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable UUID id) {
        projetoService.excluir(id);
    }
}
