package br.org.institutoettore.api.config;

import br.org.institutoettore.api.domain.Conta;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtService {
    private final SecretKey chave;
    private final long validadeMs;

    public JwtService(
        @Value("${jwt.secret}") String segredo,
        @Value("${jwt.expiration-ms}") long validadeMs,
        @Value("${spring.profiles.active:}") String perfis
    ) {
        byte[] bytes = segredo.startsWith("base64:")
            ? Decoders.BASE64.decode(segredo.substring("base64:".length()))
            : segredo.getBytes(StandardCharsets.UTF_8);
        if (bytes.length < 32) {
            throw new IllegalStateException("JWT_SECRET deve ter pelo menos 256 bits.");
        }
        if (perfis.contains("prod") && segredo.startsWith("dev-secret")) {
            throw new IllegalStateException("JWT_SECRET precisa ser definido em produção.");
        }
        this.chave = Keys.hmacShaKeyFor(bytes);
        this.validadeMs = validadeMs;
    }

    public String gerarToken(Conta conta) {
        Instant agora = Instant.now();
        return Jwts.builder()
            .subject(conta.getId().toString())
            .claim("nome", conta.getNome())
            .claim("email", conta.getContato().getEmail())
            .claim("role", conta.getRole().name())
            .issuedAt(Date.from(agora))
            .expiration(Date.from(agora.plusMillis(validadeMs)))
            .signWith(chave)
            .compact();
    }

    public UUID extrairContaId(String token) {
        try {
            Claims claims = Jwts.parser()
                .verifyWith(chave)
                .build()
                .parseSignedClaims(token)
                .getPayload();
            return UUID.fromString(claims.getSubject());
        } catch (RuntimeException exception) {
            return null;
        }
    }
}
