import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Auth } from '../../services/auth';
import { Usuario } from '../../models/auth.models';
import { contrasenaSegura, evaluarReglas, PATRON_NOMBRE } from '../../utils/validadores';
import { mensajeError } from '../../utils/errores';

// La contraseña es opcional: solo se valida si el usuario escribió algo
function contrasenaOpcional(c: AbstractControl): ValidationErrors | null {
  return c.value ? contrasenaSegura(c) : null;
}

// Si hay contraseña nueva, la confirmación debe coincidir
function confirmacionCoincide(g: AbstractControl): ValidationErrors | null {
  const contrasena = g.get('contrasena')?.value;
  const confirmar = g.get('confirmar')?.value;
  return contrasena && contrasena !== confirmar ? { noCoinciden: true } : null;
}

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule],
  templateUrl: './perfil.html',
})
export class Perfil {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);

  usuario: Usuario | null = this.auth.usuarioActual;
  error = '';
  exito = '';

  form = this.fb.nonNullable.group(
    {
      nombre: [
        this.usuario?.nombre ?? '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(80),
          Validators.pattern(PATRON_NOMBRE),
        ],
      ],
      contrasena: ['', [contrasenaOpcional]],
      confirmar: [''],
    },
    { validators: [confirmacionCoincide] },
  );

  // Reglas de la contraseña nueva (para mostrarlas en el HTML)
  get reglas() {
    return evaluarReglas(this.form.controls.contrasena.value);
  }

  guardar(): void {
    this.error = '';
    this.exito = '';
    if (this.form.invalid || !this.usuario) {
      this.form.markAllAsTouched();
      return;
    }
    const { nombre, contrasena } = this.form.getRawValue();
    if (this.auth.nombreExiste(nombre, this.usuario.idUsuario)) {
      this.error = 'Ese nombre de usuario ya está en uso.';
      return;
    }
    this.auth
      .actualizar(this.usuario.idUsuario, {
        nombre,
        correo: this.usuario.correo,
        rol: this.usuario.rol,
        contrasena: contrasena || undefined,
      })
      .subscribe({
        next: (u) => {
          this.usuario = u;
          this.form.patchValue({ contrasena: '', confirmar: '' });
          this.exito = 'Perfil actualizado correctamente.';
        },
        error: (e) => (this.error = mensajeError(e)),
      });
  }
}
