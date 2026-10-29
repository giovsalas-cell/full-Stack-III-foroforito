package com.foroforito.demo.dto;

import java.time.LocalDateTime;
import java.util.Map;

public record ApiError(
        LocalDateTime fecha,
        int estado,
        String error,
        String mensaje,
        Map<String, String> detalles) {
}