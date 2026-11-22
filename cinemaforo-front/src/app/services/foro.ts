import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { API } from '../config/api';
import { Categoria, Comentario, Tema, TemaNuevo } from '../models/foro.models';

@Injectable({ providedIn: 'root' })
export class Foro {
  private http = inject(HttpClient);
  private base = API.foro;

  private categoriasSubject = new BehaviorSubject<Categoria[]>([]);
  readonly categorias$ = this.categoriasSubject.asObservable();

  constructor() {
    this.cargarCategorias();
  }

  // ---------- Categorías ----------

  cargarCategorias(): void {
    this.http.get<Categoria[]>(`${this.base}/categorias`).subscribe({
      next: (lista) => this.categoriasSubject.next(lista),
      error: () => {},
    });
  }

  categoriaNombre(idCategoria: number): string {
    return this.categoriasSubject.value.find((c) => c.idCategoria === idCategoria)?.nombre ?? '';
  }

  // ---------- Temas ----------

  temas(): Observable<Tema[]> {
    return this.http.get<Tema[]>(`${this.base}/temas`);
  }

  populares(): Observable<Tema[]> {
    return this.http.get<Tema[]>(`${this.base}/temas/populares`);
  }

  buscar(texto: string): Observable<Tema[]> {
    return this.http.get<Tema[]>(`${this.base}/temas/buscar`, { params: { texto } });
  }

  porCategoria(idCategoria: number): Observable<Tema[]> {
    return this.http.get<Tema[]>(`${this.base}/temas/categoria/${idCategoria}`);
  }

  obtenerTema(idTema: number): Observable<Tema> {
    return this.http.get<Tema>(`${this.base}/temas/${idTema}`);
  }

  crearTema(d: TemaNuevo): Observable<Tema> {
    return this.http.post<Tema>(`${this.base}/temas`, {
      titulo: d.titulo.trim(),
      contenido: d.contenido.trim(),
      idUsuario: d.idUsuario,
      idCategoria: d.idCategoria,
    });
  }

  // ---------- Comentarios ----------

  comentarios(idTema: number): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(`${this.base}/temas/${idTema}/comentarios`);
  }

  comentar(idTema: number, contenido: string, idUsuario: number): Observable<Comentario> {
    return this.http.post<Comentario>(`${this.base}/temas/${idTema}/comentarios`, {
      contenido: contenido.trim(),
      idUsuario,
    });
  }
}
