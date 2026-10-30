package com.foroforito.foroforito.controller;

import com.foroforito.foroforito.dto.*;
import com.foroforito.foroforito.service.TemaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/temas")
@RequiredArgsConstructor
public class TemaController {

    private final TemaService temaService;

    @PostMapping
    public ResponseEntity<TemaResponse> crear(@Valid @RequestBody TemaRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(temaService.crear(req));
    }

    @GetMapping
    public List<TemaResponse> listar() {
        return temaService.listar();
    }

    @GetMapping("/{id}")
    public TemaResponse buscar(@PathVariable Long id) {
        return temaService.buscarPorId(id);
    }

    @GetMapping("/buscar")
    public List<TemaResponse> buscarPorTitulo(@RequestParam String texto) {
        return temaService.buscarPorTitulo(texto);
    }

    @GetMapping("/categoria/{idCategoria}")
    public List<TemaResponse> porCategoria(@PathVariable Long idCategoria) {
        return temaService.porCategoria(idCategoria);
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<TemaResponse> porUsuario(@PathVariable Long idUsuario) {
        return temaService.porUsuario(idUsuario);
    }

    @GetMapping("/populares")
    public List<TemaResponse> populares() {
        return temaService.populares();
    }

    @PutMapping("/{id}")
    public TemaResponse actualizar(@PathVariable Long id, @Valid @RequestBody TemaRequest req) {
        return temaService.actualizar(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        temaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}