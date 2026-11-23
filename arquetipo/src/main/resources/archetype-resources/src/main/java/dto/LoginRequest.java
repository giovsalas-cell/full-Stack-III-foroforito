#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package}.dto;

import jakarta.validation.constraints.*;

public record LoginRequest(
        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "El correo no tiene un formato válido")
        String correo,

        @NotBlank(message = "La contraseña es obligatoria")
        String contrasena
) {}