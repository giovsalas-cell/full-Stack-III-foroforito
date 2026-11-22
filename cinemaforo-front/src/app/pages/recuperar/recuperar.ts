import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { mensajeError } from '../../utils/errores';

@Component({
  selector: 'app-recuperar',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './recuperar.html',
  styleUrl: './recuperar.css',
})
export class Recuperar {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);

  enviado = false;
  error = '';
  form = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
  });

  enviar(): void {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.auth.recuperar(this.form.controls.correo.value).subscribe({
      next: () => (this.enviado = true),
      error: (e) => (this.error = mensajeError(e)),
    });
  }
}
