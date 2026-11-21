import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Foro } from '../../services/foro';

type Filtro = 'TODOS' | 'ACTIVO' | 'BANEADO';

@Component({
  selector: 'app-admin-comentarios',
  imports: [AsyncPipe, DatePipe],
  templateUrl: './admin-comentarios.html',
  styleUrl: './admin-comentarios.css',
})
export class AdminComentarios {
  private foro = inject(Foro);
  private filtro$ = new BehaviorSubject<Filtro>('TODOS');

  filtros: Filtro[] = ['TODOS', 'ACTIVO', 'BANEADO'];
  filtroActual: Filtro = 'TODOS';

  comentarios$ = combineLatest([this.foro.comentarios$, this.filtro$]).pipe(
    map(([lista, filtro]) => lista.filter((c) => filtro === 'TODOS' || c.estado === filtro)),
  );

  cambiarFiltro(filtro: Filtro): void {
    this.filtroActual = filtro;
    this.filtro$.next(filtro);
  }

  tituloTema(idTema: number): string {
    return this.foro.obtenerTema(idTema)?.titulo ?? '—';
  }

  banear(id: number): void {
    this.foro.cambiarEstadoComentario(id, 'BANEADO');
  }

  reactivar(id: number): void {
    this.foro.cambiarEstadoComentario(id, 'ACTIVO');
  }
}
