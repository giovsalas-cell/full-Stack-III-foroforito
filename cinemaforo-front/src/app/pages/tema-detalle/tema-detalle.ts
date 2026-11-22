import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Foro } from '../../services/foro';
import { Auth } from '../../services/auth';
import { Comentario, Tema } from '../../models/foro.models';
import { mensajeError } from '../../utils/errores';

@Component({
  selector: 'app-tema-detalle',
  imports: [RouterLink, ReactiveFormsModule, DatePipe],
  templateUrl: './tema-detalle.html',
})
export class TemaDetalle {
  private foro = inject(Foro);
  private ruta = inject(ActivatedRoute);
  auth = inject(Auth);

  idTema = Number(this.ruta.snapshot.paramMap.get('id'));

  tema = signal<Tema | null>(null);
  comentarios = signal<Comentario[]>([]);
  error = signal('');
  errorComentario = signal('');

  texto = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(2), Validators.maxLength(500)],
  });

  constructor() {
    this.cargarTema();
    this.cargarComentarios();
  }

  private cargarTema(): void {
    this.foro.obtenerTema(this.idTema).subscribe({
      next: (t) => this.tema.set(t),
      error: (e) => this.error.set(mensajeError(e)),
    });
  }

  private cargarComentarios(): void {
    this.foro.comentarios(this.idTema).subscribe({
      next: (lista) => this.comentarios.set(lista),
      error: () => {},
    });
  }

  autor(idUsuario: number): string {
    return this.auth.nombreDe(idUsuario);
  }

  comentar(): void {
    this.errorComentario.set('');
    const usuario = this.auth.usuarioActual;
    if (!usuario) return;
    if (this.texto.invalid) {
      this.texto.markAsTouched();
      return;
    }
    this.foro.comentar(this.idTema, this.texto.value, usuario.idUsuario).subscribe({
      next: () => {
        this.texto.reset('');
        this.cargarComentarios();
        this.cargarTema(); // actualiza el contador de comentarios
      },
      error: (e) => this.errorComentario.set(mensajeError(e)),
    });
  }
}
