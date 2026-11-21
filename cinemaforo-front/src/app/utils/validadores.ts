import { AbstractControl, ValidationErrors } from '@angular/forms';

// Reglas de la contraseña (se usan para validar y para mostrar la lista)
export function evaluarReglas(p: string) {
  return [
    { texto: 'Entre 8 y 20 caracteres', ok: p.length >= 8 && p.length <= 20 },
    { texto: 'Al menos una letra mayúscula', ok: /[A-Z]/.test(p) },
    { texto: 'Al menos un número', ok: /\d/.test(p) },
    { texto: 'Al menos un carácter especial (!@#$%&*...)', ok: /[^A-Za-z0-9]/.test(p) },
  ];
}

export function contrasenaSegura(c: AbstractControl): ValidationErrors | null {
  const ok = evaluarReglas(c.value ?? '').every((r) => r.ok);
  return ok ? null : { insegura: true };
}

export function coinciden(g: AbstractControl): ValidationErrors | null {
  return g.get('contrasena')?.value === g.get('confirmar')?.value ? null : { noCoinciden: true };
}
