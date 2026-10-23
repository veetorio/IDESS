package br.org.institutoettore.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Base64;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.MOCK,
    properties = {
        "app.admin.email=admin@instituto.test",
        "app.admin.password=SenhaAdminSegura123",
        "app.admin.nome=Admin de Teste",
        "app.admin.telefone=11999990000"
    }
)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class FluxoApiIntegrationTest {
    private static final byte[] PNG_TESTE = Base64.getDecoder().decode(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/pZ8AAAAASUVORK5CYII="
    );

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void cadastraAutenticaCriaEventoEInscreveComControleDeAcessoEVagas() throws Exception {
        String email = "participante-" + UUID.randomUUID() + "@instituto.test";
        String senha = "SenhaSegura123";
        String cadastro = """
            {"nome":"Pessoa Participante","email":"%s","telefone":"11999990001","senha":"%s"}
            """.formatted(email, senha);

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(cadastro))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.role").value("COMMON"))
            .andExpect(jsonPath("$.senha").doesNotExist());

        String tokenParticipante = autenticar(email, senha);
        mockMvc.perform(get("/inscricoes"))
            .andExpect(status().isUnauthorized());

        mockMvc.perform(multipart("/eventos")
                .file(parteEvento())
                .header("Authorization", "Bearer " + tokenParticipante)
            )
            .andExpect(status().isForbidden());

        String tokenAdmin = autenticar("admin@instituto.test", "SenhaAdminSegura123");
        String eventoJson = mockMvc.perform(multipart("/eventos")
                .file(parteEvento())
                .header("Authorization", "Bearer " + tokenAdmin)
            )
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.vagasOcupadas").value(0))
            .andReturn()
            .getResponse()
            .getContentAsString();

        String eventoId = objectMapper.readTree(eventoJson).get("id").asText();
        String inscricao = """
            {"eventoId":"%s"}
            """.formatted(eventoId);

        mockMvc.perform(post("/inscricoes")
                .header("Authorization", "Bearer " + tokenAdmin)
                .contentType(MediaType.APPLICATION_JSON)
                .content(inscricao))
            .andExpect(status().isForbidden());

        mockMvc.perform(post("/inscricoes")
                .header("Authorization", "Bearer " + tokenParticipante)
                .contentType(MediaType.APPLICATION_JSON)
                .content(inscricao))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.evento.vagasOcupadas").value(1));

        mockMvc.perform(post("/inscricoes")
                .header("Authorization", "Bearer " + tokenParticipante)
                .contentType(MediaType.APPLICATION_JSON)
                .content(inscricao))
            .andExpect(status().isConflict());

        String segundoEmail = "participante-" + UUID.randomUUID() + "@instituto.test";
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"nome":"Segunda Pessoa","email":"%s","telefone":"11999990002","senha":"%s"}
                    """.formatted(segundoEmail, senha)))
            .andExpect(status().isCreated());
        String tokenSegundoParticipante = autenticar(segundoEmail, senha);
        mockMvc.perform(post("/inscricoes")
                .header("Authorization", "Bearer " + tokenSegundoParticipante)
                .contentType(MediaType.APPLICATION_JSON)
                .content(inscricao))
            .andExpect(status().isConflict());

        mockMvc.perform(get("/inscricoes")
                .header("Authorization", "Bearer " + tokenParticipante))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(1));

        mockMvc.perform(put("/eventos/" + eventoId)
                .header("Authorization", "Bearer " + tokenAdmin)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"nome":"Evento de Teste","descricao":"Descrição atualizada",
                     "imgs":[],"vagasTotais":1,"aberto":false}
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.aberto").value(false));
    }

    @Test
    void criaEventoRecebendoImagensPorMultipartFormData() throws Exception {
        String tokenAdmin = autenticar("admin@instituto.test", "SenhaAdminSegura123");
        MockMultipartFile dadosEvento = new MockMultipartFile(
            "evento",
            "",
            MediaType.APPLICATION_JSON_VALUE,
            """
                {"nome":"Evento com imagem","descricao":"Descrição do evento",
                 "vagasTotais":5,"aberto":true}
                """.getBytes()
        );
        MockMultipartFile imagem = new MockMultipartFile(
            "imagens",
            "foto.png",
            MediaType.IMAGE_PNG_VALUE,
            PNG_TESTE
        );

        String resposta = mockMvc.perform(multipart("/eventos")
                .file(dadosEvento)
                .file(imagem)
                .header("Authorization", "Bearer " + tokenAdmin))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.imgs.length()").value(1))
            .andReturn()
            .getResponse()
            .getContentAsString();

        String caminhoImagem = objectMapper.readTree(resposta).get("imgs").get(0).asText();
        mockMvc.perform(get(caminhoImagem))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.IMAGE_PNG))
            .andExpect(content().bytes(PNG_TESTE));
    }

    private String autenticar(String email, String senha) throws Exception {
        String resposta = mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"email":"%s","senha":"%s"}
                    """.formatted(email, senha)))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();

        JsonNode json = objectMapper.readTree(resposta);
        return json.get("token").asText();
    }

    private MockMultipartFile parteEvento() {
        return new MockMultipartFile(
            "evento",
            "",
            MediaType.APPLICATION_JSON_VALUE,
            """
                {"nome":"Evento de Teste","descricao":"Descrição do evento",
                 "vagasTotais":1,"aberto":true}
                """.getBytes()
        );
    }
}
