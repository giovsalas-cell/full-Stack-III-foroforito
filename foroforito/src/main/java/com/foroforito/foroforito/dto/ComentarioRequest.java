package com.foroforito.foroforito.dto;

import jakarta.validation.constraints.*;

public record ComentarioRequest(
        @NotBlank(message = "El comentario no puede estar vacío") @Size(max = 1000, message = "El comentario no puede superar los 1000 caracteres") String contenido,

        @NotNull(message = "El usuario es obligatorio") Long idUsuario) {
}