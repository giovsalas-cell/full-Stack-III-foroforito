package com.foroforito.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RecuperarRequest(
        @NotBlank(message = "El correo es obligatorio") @Email(message = "El correo no tiene un formato válido") String correo) {
}