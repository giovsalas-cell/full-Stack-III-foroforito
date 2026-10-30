package com.foroforito.foroforito.service;

import com.foroforito.foroforito.dto.*;
import com.foroforito.foroforito.model.*;
import com.foroforito.foroforito.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TemaService {

    private static final String ACTIVO = "ACTIVO";

    private final TemaRepository temaRepository;
    private final CategoriaRepository categoriaRepository;
    private final ComentarioRepository comentarioRepository;

    public TemaResponse crear(TemaRequest req) {
        Tema t = new Tema();
        t.setIdUsuario(req.idUsuario());
        aplicarDatos(t, req);
        Tema guardado = temaRepository.save(t);
        log.info("Tema {} creado por el usuario {}", guardado.getIdTema(), guardado.getIdUsuario());
        return aResponse(guardado);
    }

    public List<TemaResponse> listar() {
        return temaRepository.findByEstadoOrderByFechaDesc(ACTIVO).stream().map(this::aResponse).toList();
    }

    public TemaResponse buscarPorId(Long id) {
        return aResponse(obtener(id));
    }

    // Consulta compleja 1: buscar por palabra del título
    public List<TemaResponse> buscarPorTitulo(String texto) {
        return temaRepository.findByTituloContainingIgnoreCaseAndEstado(texto, ACTIVO)
                .stream().map(this::aResponse).toList();
    }

    // Consulta compleja 2: temas de una categoría
    public List<TemaResponse> porCategoria(Long idCategoria) {
        if (!categoriaRepository.existsById(idCategoria)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "La categoría no existe");
        }
        return temaRepository.findByCategoriaIdCategoriaAndEstado(idCategoria, ACTIVO)
                .stream().map(this::aResponse).toList();
    }

    // Consulta compleja 3: temas publicados por un usuario
    public List<TemaResponse> porUsuario(Long idUsuario) {
        return temaRepository.findByIdUsuarioAndEstado(idUsuario, ACTIVO)
                .stream().map(this::aResponse).toList();
    }

    // Consulta compleja 4: los 5 temas con más comentarios
    public List<TemaResponse> populares() {
        return temaRepository.findByEstadoOrderByFechaDesc(ACTIVO).stream()
                .map(this::aResponse)
                .sorted(Comparator.comparingLong(TemaResponse::totalComentarios).reversed())
                .limit(5)
                .toList();
    }

    public TemaResponse actualizar(Long id, TemaRequest req) {
        Tema t = obtener(id);
        aplicarDatos(t, req);
        return aResponse(temaRepository.save(t));
    }

    @Transactional
    public void eliminar(Long id) {
        Tema t = obtener(id);
        comentarioRepository.deleteAll(comentarioRepository.findByTemaIdTema(id));
        temaRepository.delete(t);
        log.info("Tema {} eliminado junto a sus comentarios", id);
    }

    // ---- auxiliares ----
    private Tema obtener(Long id) {
        return temaRepository.findById(id)
                .filter(t -> ACTIVO.equals(t.getEstado()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tema no encontrado"));
    }

    private void aplicarDatos(Tema t, TemaRequest req) {
        Categoria c = categoriaRepository.findById(req.idCategoria())
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "La categoría indicada no existe"));
        t.setTitulo(req.titulo());
        t.setContenido(req.contenido());
        t.setCategoria(c);
    }

    private TemaResponse aResponse(Tema t) {
        long total = comentarioRepository.countByTemaIdTemaAndEstado(t.getIdTema(), ACTIVO);
        return new TemaResponse(t.getIdTema(), t.getTitulo(), t.getContenido(), t.getFecha(),
                t.getEstado(), t.getIdUsuario(), t.getCategoria().getNombre(), total);
    }
}