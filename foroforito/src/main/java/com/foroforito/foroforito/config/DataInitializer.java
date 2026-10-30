package com.foroforito.foroforito.config;

import com.foroforito.foroforito.model.Categoria;
import com.foroforito.foroforito.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;

    @Override
    public void run(String... args) {
        String[][] categorias = {
                { "Estrenos y cartelera", "Lo último que llega a los cines" },
                { "Reseñas y críticas", "Opiniones sobre películas" },
                { "Series y streaming", "Series y plataformas de streaming" },
                { "Clásicos y cine de autor", "Cine clásico y directores de culto" },
                { "Teorías y debates", "Teorías de fans y debates cinéfilos" }
        };
        for (String[] c : categorias) {
            if (categoriaRepository.findByNombre(c[0]).isEmpty()) {
                categoriaRepository.save(new Categoria(null, c[0], c[1]));
            }
        }
    }
}