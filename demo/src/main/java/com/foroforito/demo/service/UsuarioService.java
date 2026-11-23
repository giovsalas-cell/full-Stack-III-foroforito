package com.foroforito.demo.service;

import com.foroforito.demo.dto.*;
import com.foroforito.demo.model.*;
import com.foroforito.demo.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;

    public UsuarioResponse crear(UsuarioRequest req) {
        if (usuarioRepository.existsByCorreo(req.correo())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un usuario con ese correo");
        }
        // Patrón de diseño Builder: el usuario se construye paso a paso y de forma
        // legible
        Usuario u = Usuario.builder()
                .nombre(req.nombre())
                .correo(req.correo())
                .contrasena(req.contrasena())
                .rol(buscarRol(req.idRol()))
                .build();
        Usuario guardado = usuarioRepository.save(u);
        log.info("Usuario creado con id {}", guardado.getIdUsuario());
        return aResponse(guardado);
    }

    public List<UsuarioResponse> listar() {
        return usuarioRepository.findAll().stream().map(this::aResponse).toList();
    }

    public UsuarioResponse buscarPorId(Long id) {
        return aResponse(obtener(id));
    }

    public List<UsuarioResponse> listarPorRol(String nombreRol) {
        return usuarioRepository.findByRolNombre(nombreRol.toUpperCase())
                .stream().map(this::aResponse).toList();
    }

    public UsuarioResponse actualizar(Long id, UsuarioActualizarRequest req) {
        Usuario u = obtener(id);
        if (!u.getCorreo().equalsIgnoreCase(req.correo()) && usuarioRepository.existsByCorreo(req.correo())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un usuario con ese correo");
        }
        u.setNombre(req.nombre());
        u.setCorreo(req.correo());
        u.setRol(buscarRol(req.idRol()));
        if (req.contrasena() != null && !req.contrasena().isBlank()) {
            u.setContrasena(req.contrasena());
        }
        return aResponse(usuarioRepository.save(u));
    }

    // Recuperación simulada: solo registra la solicitud (no revela si el correo
    // existe)
    public void recuperar(String correo) {
        log.info("Solicitud de recuperación de contraseña para {}", correo);
    }

    public void eliminar(Long id) {
        usuarioRepository.delete(obtener(id));
        log.info("Usuario {} eliminado", id);
    }

    public UsuarioResponse login(LoginRequest req) {
        Usuario u = usuarioRepository.findByCorreo(req.correo())
                .filter(x -> x.getContrasena().equals(req.contrasena()))
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Correo o contraseña incorrectos"));
        return aResponse(u);
    }

    // ---- métodos auxiliares ----
    private Usuario obtener(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    }

    private Rol buscarRol(Long idRol) {
        return rolRepository.findById(idRol)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "El rol indicado no existe"));
    }

    private UsuarioResponse aResponse(Usuario u) {
        return new UsuarioResponse(u.getIdUsuario(), u.getNombre(), u.getCorreo(),
                u.getRol().getNombre(), u.getFechaRegistro());
    }
}