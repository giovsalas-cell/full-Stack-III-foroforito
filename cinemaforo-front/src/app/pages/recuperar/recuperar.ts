import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

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

  form = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
  });

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // Se simula el envío; el mensaje es el mismo exista o no el correo
    this.auth.recuperar(this.form.controls.correo.value);
    this.enviado = true;
  }
}
