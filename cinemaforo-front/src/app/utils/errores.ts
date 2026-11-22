import { HttpErrorResponse } from '@angular/common/http';

// Convierte un error del backend en un mensaje para mostrar en pantalla
export function mensajeError(e: unknown): string {
  if (e instanceof HttpErrorResponse) {
    if (e.status === 0) {
      return 'No se pudo conectar con el servidor. Revisa que los microservicios estén corriendo.';
    }
    return e.error?.mensaje ?? 'Ocurrió un error inesperado.';
  }
  return 'Ocurrió un error inesperado.';
}
