package br.org.institutoettore.api.service;

import br.org.institutoettore.api.exception.RequisicaoInvalidaException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ProjetoArquivoStorageService {
    private static final long TAMANHO_MAXIMO_BYTES = 5L * 1024 * 1024;
    private final Path diretorio;

    public ProjetoArquivoStorageService(@Value("${app.upload.dir:uploads}") String diretorio) {
        this.diretorio = Path.of(diretorio).toAbsolutePath().normalize().resolve("projetos");
    }

    public String armazenarLogo(MultipartFile arquivo) {
        ArquivoValidado imagem = validar(arquivo, true);
        return armazenar(imagem);
    }

    public List<String> armazenarFotos(List<MultipartFile> arquivos) {
        if (arquivos == null || arquivos.isEmpty()) return List.of();
        List<ArquivoValidado> fotos = arquivos.stream()
            .map(arquivo -> validar(arquivo, false))
            .toList();
        List<Path> gravados = new ArrayList<>();
        try {
            Files.createDirectories(diretorio);
            List<String> caminhos = new ArrayList<>();
            for (ArquivoValidado foto : fotos) {
                String nome = UUID.randomUUID() + "." + foto.extensao();
                Path destino = diretorio.resolve(nome);
                Files.write(
                    destino,
                    foto.conteudo(),
                    StandardOpenOption.CREATE_NEW,
                    StandardOpenOption.WRITE
                );
                gravados.add(destino);
                caminhos.add("/uploads/projetos/" + nome);
            }
            return caminhos;
        } catch (IOException exception) {
            removerGravados(gravados, exception);
            throw new UncheckedIOException("Não foi possível armazenar as fotos do projeto.", exception);
        }
    }

    private String armazenar(ArquivoValidado arquivo) {
        try {
            Files.createDirectories(diretorio);
            String nome = UUID.randomUUID() + "." + arquivo.extensao();
            Files.write(
                diretorio.resolve(nome),
                arquivo.conteudo(),
                StandardOpenOption.CREATE_NEW,
                StandardOpenOption.WRITE
            );
            return "/uploads/projetos/" + nome;
        } catch (IOException exception) {
            throw new UncheckedIOException("Não foi possível armazenar a logo do projeto.", exception);
        }
    }

    private ArquivoValidado validar(MultipartFile arquivo, boolean permitirSvg) {
        if (arquivo == null || arquivo.isEmpty()) {
            throw new RequisicaoInvalidaException("Envie um arquivo de imagem válido.");
        }
        if (arquivo.getSize() > TAMANHO_MAXIMO_BYTES) {
            throw new RequisicaoInvalidaException("Cada imagem pode ter no máximo 5 MB.");
        }
        try {
            byte[] bytes = arquivo.getBytes();
            String extensao = detectarExtensao(bytes, permitirSvg);
            if (extensao == null) {
                throw new RequisicaoInvalidaException(
                    permitirSvg
                        ? "A logo deve ser PNG, JPEG ou SVG."
                        : "As fotos devem ser imagens PNG, JPEG ou GIF."
                );
            }
            return new ArquivoValidado(bytes, extensao);
        } catch (IOException exception) {
            throw new UncheckedIOException("Não foi possível ler o arquivo enviado.", exception);
        }
    }

    private String detectarExtensao(byte[] bytes, boolean permitirSvg) {
        if (bytes.length >= 8 && (bytes[0] & 0xff) == 0x89
            && bytes[1] == 'P' && bytes[2] == 'N' && bytes[3] == 'G'
            && (bytes[4] & 0xff) == 0x0d && (bytes[5] & 0xff) == 0x0a
            && (bytes[6] & 0xff) == 0x1a && (bytes[7] & 0xff) == 0x0a) return "png";
        if (bytes.length >= 3 && (bytes[0] & 0xff) == 0xff
            && (bytes[1] & 0xff) == 0xd8 && (bytes[2] & 0xff) == 0xff) return "jpg";
        if (!permitirSvg && bytes.length >= 6 && bytes[0] == 'G' && bytes[1] == 'I'
            && bytes[2] == 'F' && bytes[3] == '8'
            && (bytes[4] == '7' || bytes[4] == '9') && bytes[5] == 'a') return "gif";
        if (permitirSvg && svgSeguro(bytes)) return "svg";
        return null;
    }

    private boolean svgSeguro(byte[] bytes) {
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
            factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
            factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
            factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
            factory.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
            factory.setAttribute(XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");
            factory.setXIncludeAware(false);
            factory.setExpandEntityReferences(false);
            Element root = factory.newDocumentBuilder()
                .parse(new ByteArrayInputStream(bytes)).getDocumentElement();
            if (!"svg".equals(root.getLocalName()) && !"svg".equals(root.getNodeName())) return false;
            return elementosSeguros(root);
        } catch (Exception exception) {
            return false;
        }
    }

    private boolean elementosSeguros(Element elemento) {
        if ("script".equalsIgnoreCase(elemento.getLocalName())
            || "foreignObject".equalsIgnoreCase(elemento.getLocalName())) return false;
        var attributes = elemento.getAttributes();
        for (int i = 0; i < attributes.getLength(); i++) {
            Node attribute = attributes.item(i);
            String name = attribute.getNodeName().toLowerCase();
            String value = attribute.getNodeValue().trim().toLowerCase();
            if (name.startsWith("on") || value.contains("javascript:")
                || value.contains("url(http") || value.contains("url(//")) return false;
            if ((name.equals("href") || name.endsWith(":href"))
                && !value.isEmpty() && !value.startsWith("#") && !value.startsWith("data:image/")) {
                return false;
            }
        }
        for (Node node = elemento.getFirstChild(); node != null; node = node.getNextSibling()) {
            if (node instanceof Element child && !elementosSeguros(child)) return false;
        }
        return true;
    }

    private void removerGravados(List<Path> caminhos, IOException exception) {
        try {
            for (Path caminho : caminhos) Files.deleteIfExists(caminho);
        } catch (IOException cleanupException) {
            exception.addSuppressed(cleanupException);
        }
    }

    private record ArquivoValidado(byte[] conteudo, String extensao) {}
}
