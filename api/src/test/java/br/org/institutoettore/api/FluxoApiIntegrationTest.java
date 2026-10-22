package br.org.institutoettore.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
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

        mockMvc.perform(post("/eventos")
                .header("Authorization", "Bearer " + tokenParticipante)
                .contentType(MediaType.APPLICATION_JSON)
                .content(corpoEvento()))
            .andExpect(status().isForbidden());

        String tokenAdmin = autenticar("admin@instituto.test", "SenhaAdminSegura123");
        String eventoJson = mockMvc.perform(post("/eventos")
                .header("Authorization", "Bearer " + tokenAdmin)
                .contentType(MediaType.APPLICATION_JSON)
                .content(corpoEvento()))
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

    private String corpoEvento() {
        return """
            {"nome":"Evento de Teste","descricao":"Descrição do evento",
             "imgs":["/fotos/evento.jpeg"],"vagasTotais":1,"aberto":true}
            """;
    }
}
