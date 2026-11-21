import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { Foro } from '../../services/foro';

@Component({
  selector: 'app-nuevo-tema',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './nuevo-tema.html',
  styleUrl: './nuevo-tema.css',
})
export class NuevoTema {
  private fb = inject(FormBuilder);
  private foro = inject(Foro);
  private auth = inject(Auth);
  private router = inject(Router);

  categorias = this.foro.categorias;

  form = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    idCategoria: [0, [Validators.min(1)]],
    contenido: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
  });

  publicar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const usuario = this.auth.usuarioActual;
    if (!usuario) return;

    const { titulo, idCategoria, contenido } = this.form.getRawValue();
    const id = this.foro.crearTema({
      titulo: titulo.trim(),
      contenido: contenido.trim(),
      idCategoria: Number(idCategoria),
      idUsuario: usuario.id,
      autor: usuario.nombre,
    });
    this.router.navigate(['/tema', id]);
  }
}
