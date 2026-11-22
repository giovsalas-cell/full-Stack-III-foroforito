import { Component, computed, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Admin as AdminApi } from '../../services/admin';
import { Auth } from '../../services/auth';
import { ComentarioAdmin, TemaAdmin } from '../../models/admin.models';

@Component({
  selector: 'app-admin',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './admin.html',
})
export class Admin {
  private api = inject(AdminApi);
  auth = inject(Auth);

  usuarios$ = this.auth.usuarios$;

  temas = signal<TemaAdmin[]>([]);
  comentarios = signal<ComentarioAdmin[]>([]);

  temasBaneados = computed(() => this.temas().filter((t) => t.estado === 'BANEADO').length);
  comentariosBaneados = computed(
    () => this.comentarios().filter((c) => c.estado === 'BANEADO').length,
  );

  constructor() {
    this.api.temasTodos().subscribe({ next: (l) => this.temas.set(l), error: () => {} });
    this.api
      .comentariosTodos()
      .subscribe({ next: (l) => this.comentarios.set(l), error: () => {} });
  }
}
