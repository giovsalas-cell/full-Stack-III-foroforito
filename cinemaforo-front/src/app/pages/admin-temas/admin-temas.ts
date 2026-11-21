import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Foro } from '../../services/foro';

type Filtro = 'TODOS' | 'ACTIVO' | 'BANEADO';

@Component({
  selector: 'app-admin-temas',
  imports: [AsyncPipe, DatePipe],
  templateUrl: './admin-temas.html',
  styleUrl: './admin-temas.css',
})
export class AdminTemas {
  private foro = inject(Foro);
  private filtro$ = new BehaviorSubject<Filtro>('TODOS');

  filtros: Filtro[] = ['TODOS', 'ACTIVO', 'BANEADO'];
  filtroActual: Filtro = 'TODOS';

  // Todos los temas (activos y baneados), según el filtro elegido
  temas$ = combineLatest([this.foro.temas$, this.filtro$]).pipe(
    map(([lista, filtro]) => lista.filter((t) => filtro === 'TODOS' || t.estado === filtro)),
  );

  cambiarFiltro(filtro: Filtro): void {
    this.filtroActual = filtro;
    this.filtro$.next(filtro);
  }

  nombreCategoria(id: number): string {
    return this.foro.categoriaNombre(id);
  }

  banear(id: number): void {
    this.foro.cambiarEstadoTema(id, 'BANEADO');
  }

  reactivar(id: number): void {
    this.foro.cambiarEstadoTema(id, 'ACTIVO');
  }
}
