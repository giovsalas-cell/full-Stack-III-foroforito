import { Component, computed, inject, signal } from '@angular/core';
import { Admin } from '../../services/admin';
import { Auth } from '../../services/auth';
import { ComentarioAdmin, EstadoAdmin } from '../../models/admin.models';
import { mensajeError } from '../../utils/errores';

@Component({
  selector: 'app-admin-comentarios',
  templateUrl: './admin-comentarios.html',
})
export class AdminComentarios {
  private admin = inject(Admin);
  auth = inject(Auth);

  comentarios = signal<ComentarioAdmin[]>([]);
  filtro = signal<'TODOS' | EstadoAdmin>('TODOS');
  error = signal('');

  visibles = computed(() =>
    this.comentarios().filter((c) => this.filtro() === 'TODOS' || c.estado === this.filtro()),
  );

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.admin.comentariosTodos().subscribe({
      next: (lista) => this.comentarios.set(lista),
      error: (e) => this.error.set(mensajeError(e)),
    });
  }

  cambiarFiltro(valor: string): void {
    this.filtro.set(valor as 'TODOS' | EstadoAdmin);
  }

  autor(id: number): string {
    return this.auth.nombreDe(id);
  }

  banear(c: ComentarioAdmin): void {
    this.admin.banearComentario(c.idComentario).subscribe({
      next: () => this.cargar(),
      error: (e) => this.error.set(mensajeError(e)),
    });
  }

  reactivar(c: ComentarioAdmin): void {
    this.admin.reactivarComentario(c.idComentario).subscribe({
      next: () => this.cargar(),
      error: (e) => this.error.set(mensajeError(e)),
    });
  }
}
