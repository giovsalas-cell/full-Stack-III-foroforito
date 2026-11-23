#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package}.dto;

import java.time.LocalDateTime;

public record UsuarioResponse(
        Long idUsuario,
        String nombre,
        String correo,
        String rol,
        LocalDateTime fechaRegistro) {
}