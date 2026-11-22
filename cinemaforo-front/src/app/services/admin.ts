import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { API } from '../config/api';
import { ComentarioAdmin, EstadoAdmin, TemaAdmin } from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class Admin {
  private http = inject(HttpClient);
  private base = `${API.admin}/admin`;

  private temasPorEstado(estado: EstadoAdmin): Observable<TemaAdmin[]> {
    return this.http.get<TemaAdmin[]>(`${this.base}/temas`, { params: { estado } });
  }

  private comentariosPorEstado(estado: EstadoAdmin): Observable<ComentarioAdmin[]> {
    return this.http.get<ComentarioAdmin[]>(`${this.base}/comentarios`, { params: { estado } });
  }

  // Activos + baneados juntos, ordenados por id
  temasTodos(): Observable<TemaAdmin[]> {
    return forkJoin([this.temasPorEstado('ACTIVO'), this.temasPorEstado('BANEADO')]).pipe(
      map(([a, b]) => [...a, ...b].sort((x, y) => x.idTema - y.idTema)),
    );
  }

  comentariosTodos(): Observable<ComentarioAdmin[]> {
    return forkJoin([
      this.comentariosPorEstado('ACTIVO'),
      this.comentariosPorEstado('BANEADO'),
    ]).pipe(map(([a, b]) => [...a, ...b].sort((x, y) => x.idComentario - y.idComentario)));
  }

  banearTema(id: number): Observable<TemaAdmin> {
    return this.http.put<TemaAdmin>(`${this.base}/temas/${id}/banear`, {});
  }

  reactivarTema(id: number): Observable<TemaAdmin> {
    return this.http.put<TemaAdmin>(`${this.base}/temas/${id}/reactivar`, {});
  }

  banearComentario(id: number): Observable<ComentarioAdmin> {
    return this.http.put<ComentarioAdmin>(`${this.base}/comentarios/${id}/banear`, {});
  }

  reactivarComentario(id: number): Observable<ComentarioAdmin> {
    return this.http.put<ComentarioAdmin>(`${this.base}/comentarios/${id}/reactivar`, {});
  }
}
