import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { coinciden, contrasenaSegura, evaluarReglas } from '../../utils/validadores';

// La contraseña nueva es opcional: si se deja vacía, no se cambia
function contrasenaOpcional(c: AbstractControl): ValidationErrors | null {
  return c.value ? contrasenaSegura(c) : null;
}

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);

  usuario = this.auth.usuarioActual;
  error = '';
  exito = '';

  form = this.fb.nonNullable.group(
    {
      nombre: [
        this.usuario?.nombre ?? '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.pattern(/^[A-Za-z0-9_]+$/),
        ],
      ],
      contrasena: ['', [contrasenaOpcional]],
      confirmar: [''],
    },
    { validators: coinciden },
  );

  get reglas() {
    return evaluarReglas(this.form.controls.contrasena.value);
  }

  guardar(): void {
    this.error = '';
    this.exito = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { nombre, contrasena } = this.form.getRawValue();
    if (this.usuario && nombre !== this.usuario.nombre && this.auth.nombreExiste(nombre)) {
      this.error = 'Ese nombre de usuario ya está en uso.';
      return;
    }
    this.auth.actualizarPerfil(nombre, contrasena || undefined);
    this.usuario = this.auth.usuarioActual;
    this.form.patchValue({ contrasena: '', confirmar: '' });
    this.exito = 'Perfil actualizado correctamente.';
  }
}
