package br.org.institutoettore.api.config;

import br.org.institutoettore.api.repository.ContaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class ContaDetailsService implements UserDetailsService {
    private final ContaRepository contaRepository;

    public ContaDetailsService(ContaRepository contaRepository) {
        this.contaRepository = contaRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return contaRepository.findByContatoEmail(email.toLowerCase())
            .orElseThrow(() -> new UsernameNotFoundException("Conta não encontrada."));
    }
}
