#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package}.dto;

import java.time.LocalDateTime;
import java.util.Map;

public record ApiError(
        LocalDateTime fecha,
        int estado,
        String error,
        String mensaje,
        Map<String, String> detalles) {
}