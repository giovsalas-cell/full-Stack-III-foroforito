package com.foroforito.foroforito.service;

import com.foroforito.foroforito.dto.CategoriaResponse;
import com.foroforito.foroforito.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public List<CategoriaResponse> listar() {
        return categoriaRepository.findAll().stream()
                .map(c -> new CategoriaResponse(c.getIdCategoria(), c.getNombre(), c.getDescripcion()))
                .toList();
    }
}