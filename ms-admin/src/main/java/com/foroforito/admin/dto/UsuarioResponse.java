package com.foroforito.admin.dto;

import java.time.LocalDateTime;

public record UsuarioResponse(
        Long idUsuario,
        String nombre,
        String correo,
        String rol,
        LocalDateTime fechaRegistro) {
}