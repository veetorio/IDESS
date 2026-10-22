package br.org.institutoettore.api.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import jakarta.validation.ConstraintViolationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroApi> tratarValidacao(MethodArgumentNotValidException exception) {
        Map<String, String> campos = new LinkedHashMap<>();
        for (FieldError erro : exception.getBindingResult().getFieldErrors()) {
            campos.putIfAbsent(erro.getField(), erro.getDefaultMessage());
        }
        return resposta(HttpStatus.BAD_REQUEST, "Dados inválidos.", campos);
    }

    @ExceptionHandler({
        HttpMessageNotReadableException.class,
        MethodArgumentTypeMismatchException.class
    })
    public ResponseEntity<ErroApi> tratarRequisicaoInvalida(Exception exception) {
        return resposta(HttpStatus.BAD_REQUEST, "Requisição inválida.", Map.of());
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErroApi> tratarParametrosInvalidos(ConstraintViolationException exception) {
        return resposta(HttpStatus.BAD_REQUEST, "Parâmetros inválidos.", Map.of());
    }

    @ExceptionHandler(RequisicaoInvalidaException.class)
    public ResponseEntity<ErroApi> tratarRequisicaoInvalida(RequisicaoInvalidaException exception) {
        return resposta(HttpStatus.BAD_REQUEST, exception.getMessage(), Map.of());
    }

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroApi> tratarNaoEncontrado(RecursoNaoEncontradoException exception) {
        return resposta(HttpStatus.NOT_FOUND, exception.getMessage(), Map.of());
    }

    @ExceptionHandler(ConflitoException.class)
    public ResponseEntity<ErroApi> tratarConflito(ConflitoException exception) {
        return resposta(HttpStatus.CONFLICT, exception.getMessage(), Map.of());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErroApi> tratarCredenciaisInvalidas(BadCredentialsException exception) {
        return resposta(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos.", Map.of());
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErroApi> tratarFalhaDeAutenticacao(AuthenticationException exception) {
        return resposta(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos.", Map.of());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErroApi> tratarRestricaoDeDados(DataIntegrityViolationException exception) {
        return resposta(
            HttpStatus.CONFLICT,
            "A operação conflita com um registro existente.",
            Map.of()
        );
    }

    private ResponseEntity<ErroApi> resposta(
        HttpStatus status,
        String mensagem,
        Map<String, String> campos
    ) {
        return ResponseEntity.status(status).body(
            new ErroApi(mensagem, status.value(), Instant.now(), campos)
        );
    }
}
