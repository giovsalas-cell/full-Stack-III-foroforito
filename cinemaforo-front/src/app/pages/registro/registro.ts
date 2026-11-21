import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

// Reglas de la contraseña (se usan para validar y para mostrar la lista)

import { coinciden, contrasenaSegura, evaluarReglas } from '../../utils/validadores';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  error = '';
  exito = '';

  form = this.fb.nonNullable.group(
    {
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.pattern(/^[A-Za-z0-9_]+$/),
        ],
      ],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, contrasenaSegura]],
      confirmar: ['', [Validators.required]],
      normas: [false, [Validators.requiredTrue]],
    },
    { validators: coinciden },
  );

  get reglas() {
    return evaluarReglas(this.form.controls.contrasena.value);
  }

  registrar(): void {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { nombre, correo, contrasena } = this.form.getRawValue();
    if (this.auth.registrar(nombre, correo, contrasena)) {
      this.exito = 'Cuenta creada con éxito. Te llevamos al inicio de sesión...';
      setTimeout(() => this.router.navigate(['/login']), 1500);
    } else {
      this.error = 'El correo o el nombre de usuario ya está registrado.';
    }
  }
}
