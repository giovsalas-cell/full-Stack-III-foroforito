package com.foroforito.foroforito.service;

import com.foroforito.foroforito.dto.*;
import com.foroforito.foroforito.model.*;
import com.foroforito.foroforito.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ComentarioService {

    private static final String ACTIVO = "ACTIVO";

    private final ComentarioRepository comentarioRepository;
    private final TemaRepository temaRepository;

    public ComentarioResponse crear(Long idTema, ComentarioRequest req) {
        Tema tema = temaActivo(idTema);
        Comentario c = new Comentario();
        c.setContenido(req.contenido());
        c.setIdUsuario(req.idUsuario());
        c.setTema(tema);
        Comentario guardado = comentarioRepository.save(c);
        log.info("Comentario {} agregado al tema {}", guardado.getIdComentario(), idTema);
        return aResponse(guardado);
    }

    // Consulta compleja 5: comentarios de un tema, en orden cronológico
    public List<ComentarioResponse> listarPorTema(Long idTema) {
        temaActivo(idTema);
        return comentarioRepository.findByTemaIdTemaAndEstadoOrderByFechaAsc(idTema, ACTIVO)
                .stream().map(this::aResponse).toList();
    }

    public void eliminar(Long idComentario) {
        Comentario c = comentarioRepository.findById(idComentario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comentario no encontrado"));
        comentarioRepository.delete(c);
        log.info("Comentario {} eliminado", idComentario);
    }

    private Tema temaActivo(Long idTema) {
        return temaRepository.findById(idTema)
                .filter(t -> ACTIVO.equals(t.getEstado()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tema no encontrado"));
    }

    private ComentarioResponse aResponse(Comentario c) {
        return new ComentarioResponse(c.getIdComentario(), c.getContenido(), c.getFecha(),
                c.getEstado(), c.getIdUsuario(), c.getTema().getIdTema());
    }
}