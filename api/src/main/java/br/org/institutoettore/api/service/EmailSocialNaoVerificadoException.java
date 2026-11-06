package br.org.institutoettore.api.service;

public class EmailSocialNaoVerificadoException extends RuntimeException {
    public EmailSocialNaoVerificadoException() {
        super(
            "Este e-mail já possui cadastro. Faça login com sua senha; "
                + "o provedor não confirmou o e-mail para vinculação automática."
        );
    }
}
