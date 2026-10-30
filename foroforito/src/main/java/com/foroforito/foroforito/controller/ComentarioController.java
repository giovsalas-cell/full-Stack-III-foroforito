package com.foroforito.foroforito.controller;

import com.foroforito.foroforito.dto.*;
import com.foroforito.foroforito.service.ComentarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ComentarioController {

    private final ComentarioService comentarioService;

    @PostMapping("/temas/{idTema}/comentarios")
    public ResponseEntity<ComentarioResponse> comentar(@PathVariable Long idTema,
            @Valid @RequestBody ComentarioRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(comentarioService.crear(idTema, req));
    }

    @GetMapping("/temas/{idTema}/comentarios")
    public List<ComentarioResponse> listar(@PathVariable Long idTema) {
        return comentarioService.listarPorTema(idTema);
    }

    @DeleteMapping("/comentarios/{idComentario}")
    public ResponseEntity<Void> eliminar(@PathVariable Long idComentario) {
        comentarioService.eliminar(idComentario);
        return ResponseEntity.noContent().build();
    }
}