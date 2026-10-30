package com.foroforito.foroforito.dto;

import java.time.LocalDateTime;

public record ComentarioResponse(
        Long idComentario,
        String contenido,
        LocalDateTime fecha,
        String estado,
        Long idUsuario,
        Long idTema) {
}