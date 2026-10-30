package com.foroforito.foroforito.dto;

import jakarta.validation.constraints.*;

public record TemaRequest(
        @NotBlank(message = "El título es obligatorio") @Size(min = 5, max = 150, message = "El título debe tener entre 5 y 150 caracteres") String titulo,

        @NotBlank(message = "El contenido es obligatorio") @Size(min = 10, max = 2000, message = "El contenido debe tener entre 10 y 2000 caracteres") String contenido,

        @NotNull(message = "El usuario es obligatorio") Long idUsuario,

        @NotNull(message = "La categoría es obligatoria") Long idCategoria) {
}