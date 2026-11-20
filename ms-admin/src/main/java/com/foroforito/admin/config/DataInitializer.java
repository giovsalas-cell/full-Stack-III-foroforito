package com.foroforito.admin.config;

import com.foroforito.admin.model.Rol;
import com.foroforito.admin.repository.RolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RolRepository rolRepository;

    @Override
    public void run(String... args) {
        for (String nombre : new String[] { "USUARIO", "ADMIN" }) {
            if (rolRepository.findByNombre(nombre).isEmpty()) {
                rolRepository.save(new Rol(null, nombre));
            }
        }
    }
}