package br.org.institutoettore.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import br.org.institutoettore.api.domain.ProvedorSocial;
import br.org.institutoettore.api.dto.auth.TicketSocialResponse;
import br.org.institutoettore.api.service.EmailSocialNaoVerificadoException;
import br.org.institutoettore.api.service.LoginSocialService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.request.MockMultipartHttpServletRequestBuilder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Base64;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.MOCK,
    properties = {
        "app.admin.email=admin@instituto.test",
        "app.admin.password=SenhaAdminSegura123",
        "app.admin.nome=Admin de Teste",
        "app.admin.telefone=11999990000",
        "app.social-login.enabled=true",
        "GOOGLE_CLIENT_ID=google-client-test",
        "GOOGLE_CLIENT_SECRET=google-secret-test"
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

    @Autowired
    private LoginSocialService loginSocialService;

    @Test
    void iniciaOAuthGoogleERejeitaRedirecionamentosExternos() throws Exception {
        mockMvc.perform(get("/oauth2/authorization/google")
                .param("redirect", "https://site-malicioso.test"))
            .andExpect(status().is3xxRedirection())
            .andExpect(header().string(
                "Location",
                org.hamcrest.Matchers.containsString("accounts.google.com")
            ));
    }

    @Test
    void trocaTicketSocialUmaVezEExigeEmailVerificadoParaVincular() throws Exception {
        String email = "social-" + UUID.randomUUID() + "@instituto.test";
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"nome":"Pessoa Social","email":"%s",
                     "telefone":"11999990003","senha":"SenhaSegura123"}
                    """.formatted(email)))
            .andExpect(status().isCreated());

        TicketSocialResponse ticket = loginSocialService.criarTicket(
            ProvedorSocial.GOOGLE,
            "google-sub-" + UUID.randomUUID(),
            email,
            "Pessoa Social",
            true
        );
        String corpo = objectMapper.writeValueAsString(
            java.util.Map.of("ticket", ticket.ticket())
        );
        mockMvc.perform(post("/auth/social/exchange")
                .contentType(MediaType.APPLICATION_JSON)
                .content(corpo))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.usuario.role").value("COMMON"))
            .andExpect(jsonPath("$.token").isNotEmpty());

        mockMvc.perform(post("/auth/social/exchange")
                .contentType(MediaType.APPLICATION_JSON)
                .content(corpo))
            .andExpect(status().isBadRequest());

        assertThrows(
            EmailSocialNaoVerificadoException.class,
            () -> loginSocialService.criarTicket(
                ProvedorSocial.FACEBOOK,
                "facebook-sub-" + UUID.randomUUID(),
                email,
                "Pessoa Social",
                false
            )
        );
    }

    @Test
    void criaContaSocialNovaSomenteAposInformarTelefone() throws Exception {
        String email = "facebook-" + UUID.randomUUID() + "@instituto.test";
        TicketSocialResponse ticket = loginSocialService.criarTicket(
            ProvedorSocial.FACEBOOK,
            "facebook-sub-" + UUID.randomUUID(),
            email,
            "Pessoa Facebook",
            false
        );
        assertTrue(ticket.novoCadastro());

        String semTelefone = objectMapper.writeValueAsString(
            java.util.Map.of("ticket", ticket.ticket())
        );
        mockMvc.perform(post("/auth/social/exchange")
                .contentType(MediaType.APPLICATION_JSON)
                .content(semTelefone))
            .andExpect(status().isBadRequest());

        String comTelefone = objectMapper.writeValueAsString(
            java.util.Map.of("ticket", ticket.ticket(), "telefone", "11999990004")
        );
        mockMvc.perform(post("/auth/social/exchange")
                .contentType(MediaType.APPLICATION_JSON)
                .content(comTelefone))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.usuario.role").value("COMMON"))
            .andExpect(jsonPath("$.usuario.contato.telefone").value("11999990004"));
    }

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
                     "dataInicio":"2026-11-04","dataFim":"2026-11-04",
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
                 "dataInicio":"2026-11-04","dataFim":"2026-11-04",
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

    @Test
    void persisteProjetoComFotosECalculaEventoAssociado() throws Exception {
        String tokenAdmin = autenticar("admin@instituto.test", "SenhaAdminSegura123");
        MockMultipartFile dadosProjeto = new MockMultipartFile(
            "projeto",
            "",
            MediaType.APPLICATION_JSON_VALUE,
            """
                {"nome":"Projeto de Teste","descricao":"Descrição do projeto",
                 "participantes":42}
                """.getBytes()
        );
        MockMultipartHttpServletRequestBuilder requisicaoProjeto = multipart("/projetos")
            .file(dadosProjeto)
            .file(new MockMultipartFile("logo", "logo.png", MediaType.IMAGE_PNG_VALUE, PNG_TESTE));
        for (int i = 0; i < 4; i++) {
            requisicaoProjeto.file(new MockMultipartFile(
                "fotos",
                "foto-" + i + ".png",
                MediaType.IMAGE_PNG_VALUE,
                PNG_TESTE
            ));
        }
        requisicaoProjeto.header("Authorization", "Bearer " + tokenAdmin);

        String projetoJson = mockMvc.perform(requisicaoProjeto)
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.participantes").value(42))
            .andExpect(jsonPath("$.fotos.length()").value(4))
            .andExpect(jsonPath("$.status").value("SEM_EVENTOS"))
            .andReturn()
            .getResponse()
            .getContentAsString();
        String projetoId = objectMapper.readTree(projetoJson).get("id").asText();

        MockMultipartFile evento = new MockMultipartFile(
            "evento",
            "",
            MediaType.APPLICATION_JSON_VALUE,
            """
                {"nome":"Evento futuro do projeto","descricao":"Descrição do evento",
                 "dataInicio":"2099-10-10","dataFim":"2099-10-11","projetoId":"%s",
                 "vagasTotais":5,"aberto":true}
                """.formatted(projetoId).getBytes()
        );
        mockMvc.perform(multipart("/eventos")
                .file(evento)
                .header("Authorization", "Bearer " + tokenAdmin))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.projetoId").value(projetoId))
            .andExpect(jsonPath("$.projetoNome").value("Projeto de Teste"));

        mockMvc.perform(get("/projetos/" + projetoId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("AGENDADO"))
            .andExpect(jsonPath("$.ultimoEvento.nome").value("Evento futuro do projeto"));
    }

    @Test
    void usuarioGerenciaPreferenciaERecebeNovidadesPublicadasPeloAdmin() throws Exception {
        String email = "newsletter-" + UUID.randomUUID() + "@instituto.test";
        String senha = "SenhaSegura123";
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"nome":"Pessoa Newsletter","email":"%s",
                     "telefone":"11999990005","senha":"%s"}
                    """.formatted(email, senha)))
            .andExpect(status().isCreated());

        String tokenUsuario = autenticar(email, senha);
        mockMvc.perform(get("/newsletter"))
            .andExpect(status().isUnauthorized());
        mockMvc.perform(get("/newsletter/admin")
                .header("Authorization", "Bearer " + tokenUsuario))
            .andExpect(status().isForbidden());

        mockMvc.perform(get("/newsletter/preferencia")
                .header("Authorization", "Bearer " + tokenUsuario))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.recebeNewsletter").value(false))
            .andExpect(jsonPath("$.email").value(email));

        mockMvc.perform(put("/newsletter/preferencia")
                .header("Authorization", "Bearer " + tokenUsuario)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"recebeNewsletter":true}
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.recebeNewsletter").value(true));

        String tokenAdmin = autenticar("admin@instituto.test", "SenhaAdminSegura123");
        mockMvc.perform(post("/newsletter/admin")
                .header("Authorization", "Bearer " + tokenUsuario)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"titulo":"Novidade do Instituto","resumo":"Uma nova iniciativa",
                     "conteudo":"Conheça as ações deste mês."}
                    """))
            .andExpect(status().isForbidden());

        mockMvc.perform(post("/newsletter/admin")
                .header("Authorization", "Bearer " + tokenAdmin)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"titulo":"Novidade do Instituto","resumo":"Uma nova iniciativa",
                     "conteudo":"Conheça as ações deste mês."}
                    """))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.newsletter.titulo").value("Novidade do Instituto"))
            .andExpect(jsonPath("$.emailsEnviados").value(0))
            .andExpect(jsonPath("$.envioConfigurado").value(false));

        mockMvc.perform(get("/newsletter")
                .header("Authorization", "Bearer " + tokenUsuario))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(1))
            .andExpect(jsonPath("$[0].conteudo").value("Conheça as ações deste mês."));

        mockMvc.perform(get("/newsletter/admin")
                .header("Authorization", "Bearer " + tokenAdmin))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(1));
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
                 "dataInicio":"2026-11-04","dataFim":"2026-11-04",
                 "vagasTotais":1,"aberto":true}
                """.getBytes()
        );
    }
}
