package com.foroforito.demo.dto;

import jakarta.validation.constraints.*;

public record UsuarioRequest(
        @NotBlank(message = "El nombre es obligatorio") @Size(min = 3, max = 80, message = "El nombre debe tener entre 3 y 80 caracteres") String nombre,

        @NotBlank(message = "El correo es obligatorio") @Email(message = "El correo no tiene un formato válido") String correo,

        @NotBlank(message = "La contraseña es obligatoria") @Size(min = 6, max = 100, message = "La contraseña debe tener al menos 6 caracteres") String contrasena,

        @NotNull(message = "El rol es obligatorio") Long idRol) {
}