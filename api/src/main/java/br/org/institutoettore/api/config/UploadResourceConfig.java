package br.org.institutoettore.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

@Configuration
public class UploadResourceConfig implements WebMvcConfigurer {
    private final String diretorio;

    public UploadResourceConfig(@Value("${app.upload.dir:uploads}") String diretorio) {
        String localizacao = Path.of(diretorio).toAbsolutePath().normalize().toUri().toString();
        this.diretorio = localizacao.endsWith("/") ? localizacao : localizacao + "/";
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
            .addResourceLocations(diretorio);
    }
}
