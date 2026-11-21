package com.foroforito.admin.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.foroforito.admin.model.Comentario;
import com.foroforito.admin.model.Tema;
import com.foroforito.admin.repository.ComentarioRepository;
import com.foroforito.admin.repository.TemaRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private static final String ACTIVO = "ACTIVO";
    private static final String BANEADO = "BANEADO";

    private final TemaRepository temaRepository;
    private final ComentarioRepository comentarioRepository;

    // ---------- Consultas ----------

    public List<Tema> listarTemas(String estado) {
        return temaRepository.findByEstado(estado);
    }

    public List<Comentario> listarComentarios(String estado) {
        return comentarioRepository.findByEstado(estado);
    }

    public List<Comentario> comentariosDeTema(Long idTema) {
        return comentarioRepository.findByIdTema(idTema);
    }

    // ---------- Temas ----------

    public Tema banearTema(Long idTema) {
        return cambiarEstadoTema(idTema, BANEADO);
    }

    public Tema reactivarTema(Long idTema) {
        return cambiarEstadoTema(idTema, ACTIVO);
    }

    // ---------- Comentarios ----------

    public Comentario banearComentario(Long idComentario) {
        return cambiarEstadoComentario(idComentario, BANEADO);
    }

    public Comentario reactivarComentario(Long idComentario) {
        return cambiarEstadoComentario(idComentario, ACTIVO);
    }

    // ---------- Privados ----------

    private Tema cambiarEstadoTema(Long idTema, String nuevoEstado) {
        Tema tema = temaRepository.findById(idTema)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tema no encontrado"));
        tema.setEstado(nuevoEstado);
        Tema guardado = temaRepository.save(tema);
        log.info("Tema {} cambiado a estado {}", idTema, nuevoEstado);
        return guardado;
    }

    private Comentario cambiarEstadoComentario(Long idComentario, String nuevoEstado) {
        Comentario comentario = comentarioRepository.findById(idComentario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comentario no encontrado"));
        comentario.setEstado(nuevoEstado);
        Comentario guardado = comentarioRepository.save(comentario);
        log.info("Comentario {} cambiado a estado {}", idComentario, nuevoEstado);
        return guardado;
    }
}