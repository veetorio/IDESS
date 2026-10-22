package br.org.institutoettore.api.config;

import br.org.institutoettore.api.domain.Conta;
import br.org.institutoettore.api.repository.ContaRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final ContaRepository contaRepository;

    public JwtAuthenticationFilter(JwtService jwtService, ContaRepository contaRepository) {
        this.jwtService = jwtService;
        this.contaRepository = contaRepository;
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");
        if (authorization != null && authorization.startsWith("Bearer ")) {
            UUID contaId = jwtService.extrairContaId(authorization.substring(7));
            if (contaId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                contaRepository.findById(contaId)
                    .filter(Conta::isEnabled)
                    .ifPresent(conta -> SecurityContextHolder.getContext().setAuthentication(
                        new UsernamePasswordAuthenticationToken(
                            conta,
                            null,
                            conta.getAuthorities()
                        )
                    ));
            }
        }
        filterChain.doFilter(request, response);
    }
}
