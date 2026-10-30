package com.foroforito.foroforito.exception;

import com.foroforito.foroforito.dto.ApiError;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // Errores de validación (@NotBlank, @Email, @Size...)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> validacion(MethodArgumentNotValidException ex) {
        Map<String, String> detalles = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(e -> detalles.put(e.getField(), e.getDefaultMessage()));
        log.warn("Error de validación: {}", detalles);
        return construir(HttpStatus.BAD_REQUEST, "Datos inválidos",
                "Hay errores de validación", detalles);
    }

    // Errores que lanzamos en el servicio (404, 409, 401...)
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiError> estado(ResponseStatusException ex) {
        HttpStatus status = HttpStatus.valueOf(ex.getStatusCode().value());
        log.warn("{}: {}", status.value(), ex.getReason());
        return construir(status, status.getReasonPhrase(), ex.getReason(), null);
    }

    // JSON mal escrito o campos con tipo incorrecto
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> jsonInvalido(HttpMessageNotReadableException ex) {
        log.warn("JSON inválido: {}", ex.getMessage());
        return construir(HttpStatus.BAD_REQUEST, "Solicitud inválida",
                "El cuerpo de la solicitud está mal formado", null);
    }

    // Choques con la base de datos (por ejemplo, correo duplicado)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> integridad(DataIntegrityViolationException ex) {
        log.warn("Violación de integridad: {}", ex.getMessage());
        return construir(HttpStatus.CONFLICT, "Conflicto de datos",
                "Los datos chocan con un registro existente", null);
    }

    // Rutas que no existen
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiError> noEncontrado(NoResourceFoundException ex) {
        return construir(HttpStatus.NOT_FOUND, "No encontrado",
                "La ruta solicitada no existe", null);
    }

    // Cualquier otro error inesperado
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> general(Exception ex) {
        log.error("Error inesperado", ex);
        return construir(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno",
                "Ocurrió un error inesperado", null);
    }

    private ResponseEntity<ApiError> construir(HttpStatus status, String error,
            String mensaje, Map<String, String> detalles) {
        ApiError body = new ApiError(LocalDateTime.now(), status.value(), error, mensaje, detalles);
        return ResponseEntity.status(status).body(body);
    }
}