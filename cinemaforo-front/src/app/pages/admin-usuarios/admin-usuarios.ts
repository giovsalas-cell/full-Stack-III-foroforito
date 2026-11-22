import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Rol, Usuario } from '../../models/auth.models';
import { contrasenaSegura, evaluarReglas, PATRON_NOMBRE } from '../../utils/validadores';
import { mensajeError } from '../../utils/errores';

@Component({
  selector: 'app-admin-usuarios',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './admin-usuarios.html',
})
export class AdminUsuarios {
  private fb = inject(FormBuilder);
  auth = inject(Auth);

  usuarios$ = this.auth.usuarios$;
  roles: Rol[] = ['USUARIO', 'ADMIN'];

  mostrarForm = false;
  error = '';
  exito = '';

  form = this.fb.nonNullable.group({
    nombre: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(80),
        Validators.pattern(PATRON_NOMBRE),
      ],
    ],
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, contrasenaSegura]],
    rol: ['USUARIO' as Rol, Validators.required],
  });

  // Reglas de la contraseña (para mostrarlas en el HTML)
  get reglas() {
    return evaluarReglas(this.form.controls.contrasena.value);
  }

  esYo(u: Usuario): boolean {
    return u.idUsuario === this.auth.usuarioActual?.idUsuario;
  }

  crear(): void {
    this.error = '';
    this.exito = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const datos = this.form.getRawValue();
    if (this.auth.nombreExiste(datos.nombre)) {
      this.error = 'Ese nombre de usuario ya está en uso.';
      return;
    }
    this.auth.crear(datos).subscribe({
      next: () => {
        this.exito = `Usuario "${datos.nombre}" creado correctamente.`;
        this.form.reset({ nombre: '', correo: '', contrasena: '', rol: 'USUARIO' });
      },
      error: (e) => (this.error = mensajeError(e)),
    });
  }

  cambiarRol(u: Usuario, rol: string): void {
    this.error = '';
    this.auth.cambiarRol(u, rol as Rol).subscribe({
      error: (e) => (this.error = mensajeError(e)),
    });
  }

  eliminar(u: Usuario): void {
    if (confirm(`¿Eliminar al usuario "${u.nombre}"? Esta acción no se puede deshacer.`)) {
      this.error = '';
      this.auth.eliminar(u.idUsuario).subscribe({
        error: (e) => (this.error = mensajeError(e)),
      });
    }
  }
}
