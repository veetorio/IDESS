package br.org.institutoettore.api.service;

import br.org.institutoettore.api.domain.Conta;
import br.org.institutoettore.api.domain.Evento;
import br.org.institutoettore.api.domain.Inscricao;
import br.org.institutoettore.api.dto.conta.ContaResponse;
import br.org.institutoettore.api.dto.conta.ContatoResponse;
import br.org.institutoettore.api.dto.evento.EventoResponse;
import br.org.institutoettore.api.dto.inscricao.InscricaoResponse;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DtoMapper {
    public ContaResponse paraContaResponse(Conta conta) {
        return new ContaResponse(
            conta.getId(),
            conta.getNome(),
            new ContatoResponse(conta.getContato().getEmail(), conta.getContato().getTelefone()),
            conta.getAtividade(),
            conta.getRole()
        );
    }

    public EventoResponse paraEventoResponse(Evento evento) {
        return new EventoResponse(
            evento.getId(),
            evento.getNome(),
            evento.getDescricao(),
            List.copyOf(evento.getImgs()),
            evento.getVagasOcupadas(),
            evento.getVagasTotais(),
            evento.getAberto(),
            evento.getCriadoEm()
        );
    }

    public InscricaoResponse paraInscricaoResponse(Inscricao inscricao) {
        return new InscricaoResponse(
            inscricao.getId(),
            paraContaResponse(inscricao.getInscrito()),
            paraEventoResponse(inscricao.getEvento()),
            inscricao.getCriadoEm()
        );
    }
}
