package br.org.institutoettore.api.config;

import br.org.institutoettore.api.exception.ErroApi;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final ContaDetailsService contaDetailsService;
    private final ObjectMapper objectMapper;

    public SecurityConfig(
        JwtAuthenticationFilter jwtAuthenticationFilter,
        ContaDetailsService contaDetailsService,
        ObjectMapper objectMapper
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.contaDetailsService = contaDetailsService;
        this.objectMapper = objectMapper;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    DaoAuthenticationProvider authenticationProvider(PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(contaDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    FilterRegistrationBean<JwtAuthenticationFilter> jwtFilterRegistration(
        JwtAuthenticationFilter filter
    ) {
        FilterRegistrationBean<JwtAuthenticationFilter> registration =
            new FilterRegistrationBean<>(filter);
        registration.setEnabled(false);
        return registration;
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration configuration)
        throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    SecurityFilterChain securityFilterChain(
        HttpSecurity http,
        DaoAuthenticationProvider authenticationProvider,
        ObjectProvider<ClientRegistrationRepository> clientRegistrationRepositories,
        LoginSocialSuccessHandler loginSocialSuccessHandler,
        LoginSocialFailureHandler loginSocialFailureHandler
    ) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider)
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, exception) -> {
                    response.setStatus(HttpStatus.UNAUTHORIZED.value());
                    response.setContentType("application/json");
                    objectMapper.writeValue(
                        response.getOutputStream(),
                        new ErroApi(
                            "Autenticação necessária.",
                            HttpStatus.UNAUTHORIZED.value(),
                            Instant.now(),
                            java.util.Map.of()
                        )
                    );
                })
                .accessDeniedHandler((request, response, exception) -> {
                    response.setStatus(HttpStatus.FORBIDDEN.value());
                    response.setContentType("application/json");
                    objectMapper.writeValue(
                        response.getOutputStream(),
                        new ErroApi(
                            "Acesso não autorizado.",
                            HttpStatus.FORBIDDEN.value(),
                            Instant.now(),
                            java.util.Map.of()
                        )
                    );
                })
            )
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/auth/**", "/health").permitAll()
                .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/eventos", "/eventos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/projetos", "/projetos/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/eventos").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/eventos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/projetos").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/projetos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/projetos/**").hasRole("ADMIN")
                .requestMatchers("/newsletter/admin", "/newsletter/admin/**").hasRole("ADMIN")
                .requestMatchers("/newsletter/preferencia", "/newsletter/preferencia/**")
                    .hasRole("COMMON")
                .requestMatchers(HttpMethod.GET, "/newsletter").hasAnyRole("COMMON", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/inscricoes").hasRole("COMMON")
                .requestMatchers("/inscricoes/**").authenticated()
                .anyRequest().denyAll()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        ClientRegistrationRepository clientRegistrations =
            clientRegistrationRepositories.getIfAvailable();
        if (clientRegistrations != null) {
            http.oauth2Login(oauth2 -> oauth2
                .authorizationEndpoint(endpoint -> endpoint
                    .authorizationRequestResolver(
                        new FrontendAuthorizationRequestResolver(clientRegistrations)
                    )
                    .authorizationRequestRepository(
                        new FrontendAuthorizationRequestRepository()
                    )
                )
                .successHandler(loginSocialSuccessHandler)
                .failureHandler(loginSocialFailureHandler)
            );
        }
        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource(
        @Value("${cors.allowed-origins}") String allowedOrigins
    ) {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.stream(allowedOrigins.split(","))
            .map(String::trim)
            .filter(origin -> !origin.isEmpty())
            .toList());
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
