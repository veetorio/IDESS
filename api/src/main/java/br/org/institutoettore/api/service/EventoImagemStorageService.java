package br.org.institutoettore.api.service;

import br.org.institutoettore.api.exception.RequisicaoInvalidaException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class EventoImagemStorageService {
    private static final int MAXIMO_IMAGENS = 10;
    private static final long TAMANHO_MAXIMO_BYTES = 5L * 1024 * 1024;
    private final Path diretorio;

    public EventoImagemStorageService(@Value("${app.upload.dir:uploads}") String diretorio) {
        this.diretorio = Path.of(diretorio).toAbsolutePath().normalize();
    }

    public List<String> armazenar(List<MultipartFile> arquivos) {
        if (arquivos == null || arquivos.isEmpty()) return List.of();
        if (arquivos.size() > MAXIMO_IMAGENS) {
            throw new RequisicaoInvalidaException("O evento pode ter no máximo 10 imagens.");
        }

        List<ArquivoImagem> imagens = arquivos.stream()
            .map(this::validar)
            .toList();
        List<Path> gravados = new ArrayList<>();
        try {
            Files.createDirectories(diretorio);
            List<String> caminhos = new ArrayList<>();
            for (ArquivoImagem imagem : imagens) {
                String nome = UUID.randomUUID() + "." + imagem.extensao();
                Path destino = diretorio.resolve(nome);
                Files.write(
                    destino,
                    imagem.conteudo(),
                    StandardOpenOption.CREATE_NEW,
                    StandardOpenOption.WRITE
                );
                gravados.add(destino);
                caminhos.add("/uploads/" + nome);
            }
            return caminhos;
        } catch (IOException exception) {
            try {
                for (Path caminho : gravados) Files.deleteIfExists(caminho);
            } catch (IOException cleanupException) {
                exception.addSuppressed(cleanupException);
            }
            throw new UncheckedIOException("Não foi possível armazenar as imagens do evento.", exception);
        }
    }

    private ArquivoImagem validar(MultipartFile arquivo) {
        if (arquivo.isEmpty()) {
            throw new RequisicaoInvalidaException("Os arquivos de imagem não podem estar vazios.");
        }
        if (arquivo.getSize() > TAMANHO_MAXIMO_BYTES) {
            throw new RequisicaoInvalidaException("Cada imagem pode ter no máximo 5 MB.");
        }

        try {
            byte[] conteudo = arquivo.getBytes();
            String extensao = detectarExtensao(conteudo);
            if (extensao == null) {
                throw new RequisicaoInvalidaException(
                    "Envie imagens válidas nos formatos JPEG, PNG ou GIF."
                );
            }
            return new ArquivoImagem(conteudo, extensao);
        } catch (IOException exception) {
            throw new UncheckedIOException("Não foi possível ler uma imagem enviada.", exception);
        }
    }

    private String detectarExtensao(byte[] conteudo) {
        if (conteudo.length >= 8
            && (conteudo[0] & 0xff) == 0x89
            && conteudo[1] == 0x50
            && conteudo[2] == 0x4e
            && conteudo[3] == 0x47
            && conteudo[4] == 0x0d
            && conteudo[5] == 0x0a
            && conteudo[6] == 0x1a
            && conteudo[7] == 0x0a) {
            return "png";
        }
        if (conteudo.length >= 3
            && (conteudo[0] & 0xff) == 0xff
            && (conteudo[1] & 0xff) == 0xd8
            && (conteudo[2] & 0xff) == 0xff) {
            return "jpg";
        }
        if (conteudo.length >= 6
            && conteudo[0] == 'G'
            && conteudo[1] == 'I'
            && conteudo[2] == 'F'
            && conteudo[3] == '8'
            && (conteudo[4] == '7' || conteudo[4] == '9')
            && conteudo[5] == 'a') {
            return "gif";
        }
        return null;
    }

    private record ArquivoImagem(byte[] conteudo, String extensao) {}
}
