import { Component, computed, inject, signal } from '@angular/core';
import { Admin } from '../../services/admin';
import { Auth } from '../../services/auth';
import { EstadoAdmin, TemaAdmin } from '../../models/admin.models';
import { mensajeError } from '../../utils/errores';

@Component({
  selector: 'app-admin-temas',
  templateUrl: './admin-temas.html',
})
export class AdminTemas {
  private admin = inject(Admin);
  auth = inject(Auth);

  temas = signal<TemaAdmin[]>([]);
  filtro = signal<'TODOS' | EstadoAdmin>('TODOS');
  error = signal('');

  visibles = computed(() =>
    this.temas().filter((t) => this.filtro() === 'TODOS' || t.estado === this.filtro()),
  );

  constructor() {
    this.cargar();
  }
  cargar(): void {
    this.admin.temasTodos().subscribe({
      next: (lista) => this.temas.set(lista),
      error: (e) => this.error.set(mensajeError(e)),
    });
  }

  cambiarFiltro(valor: string): void {
    this.filtro.set(valor as 'TODOS' | EstadoAdmin);
  }

  autor(id: number): string {
    return this.auth.nombreDe(id);
  }

  banear(t: TemaAdmin): void {
    this.admin.banearTema(t.idTema).subscribe({
      next: () => this.cargar(),
      error: (e) => this.error.set(mensajeError(e)),
    });
  }

  reactivar(t: TemaAdmin): void {
    this.admin.reactivarTema(t.idTema).subscribe({
      next: () => this.cargar(),
      error: (e) => this.error.set(mensajeError(e)),
    });
  }
}
