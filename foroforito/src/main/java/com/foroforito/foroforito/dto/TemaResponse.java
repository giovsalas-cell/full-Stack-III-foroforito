package com.foroforito.foroforito.dto;

import java.time.LocalDateTime;

public record TemaResponse(
        Long idTema,
        String titulo,
        String contenido,
        LocalDateTime fecha,
        String estado,
        Long idUsuario,
        String categoria,
        long totalComentarios) {
}