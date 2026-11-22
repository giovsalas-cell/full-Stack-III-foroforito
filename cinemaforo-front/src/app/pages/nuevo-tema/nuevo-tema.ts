import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Foro } from '../../services/foro';
import { Auth } from '../../services/auth';
import { mensajeError } from '../../utils/errores';

@Component({
  selector: 'app-nuevo-tema',
  imports: [ReactiveFormsModule, RouterLink, AsyncPipe],
  templateUrl: './nuevo-tema.html',
})
export class NuevoTema {
  private fb = inject(FormBuilder);
  private foro = inject(Foro);
  private auth = inject(Auth);
  private router = inject(Router);

  categorias$ = this.foro.categorias$;
  error = '';

  form = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
    idCategoria: [0, [Validators.required, Validators.min(1)]],
    contenido: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
  });

  publicar(): void {
    this.error = '';
    const usuario = this.auth.usuarioActual;
    if (this.form.invalid || !usuario) {
      this.form.markAllAsTouched();
      return;
    }
    const { titulo, contenido, idCategoria } = this.form.getRawValue();
    this.foro
      .crearTema({
        titulo,
        contenido,
        idCategoria: Number(idCategoria),
        idUsuario: usuario.idUsuario,
      })
      .subscribe({
        next: (t) => this.router.navigate(['/tema', t.idTema]),
        error: (e) => (this.error = mensajeError(e)),
      });
  }
}
