import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { API, ROL_ID } from '../config/api';
import { Rol, Usuario } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class Auth {
  private http = inject(HttpClient);
  private base = `${API.usuarios}/usuarios`;

  private usuarioSubject = new BehaviorSubject<Usuario | null>(this.leerSesion());
  readonly usuario$ = this.usuarioSubject.asObservable();

  private usuariosSubject = new BehaviorSubject<Usuario[]>([]);
  readonly usuarios$ = this.usuariosSubject.asObservable();

  constructor() {
    this.cargarUsuarios();
  }

  get usuarioActual(): Usuario | null {
    return this.usuarioSubject.value;
  }

  get esAdmin(): boolean {
    return this.usuarioActual?.rol === 'ADMIN';
  }

  // ---------- Sesión ----------

  login(correo: string, contrasena: string): Observable<Usuario> {
    return this.http
      .post<Usuario>(`${this.base}/login`, { correo, contrasena })
      .pipe(tap((u) => this.iniciarSesion(u)));
  }

  logout(): void {
    this.usuarioSubject.next(null);
    sessionStorage.removeItem('cf_usuario');
  }

  private iniciarSesion(u: Usuario): void {
    this.usuarioSubject.next(u);
    sessionStorage.setItem('cf_usuario', JSON.stringify(u));
  }

  private leerSesion(): Usuario | null {
    try {
      const texto = sessionStorage.getItem('cf_usuario');
      const u = texto ? JSON.parse(texto) : null;
      return u && typeof u === 'object' && u.idUsuario ? (u as Usuario) : null;
    } catch {
      return null;
    }
  }

  // ---------- Usuarios (ms-usuarios) ----------

  cargarUsuarios(): void {
    this.http.get<Usuario[]>(this.base).subscribe({
      next: (lista) => this.usuariosSubject.next(lista),
      error: () => {},
    });
  }

  nombreDe(idUsuario: number): string {
    return (
      this.usuariosSubject.value.find((u) => u.idUsuario === idUsuario)?.nombre ??
      `Usuario ${idUsuario}`
    );
  }

  nombreExiste(nombre: string, exceptoId?: number): boolean {
    return this.usuariosSubject.value.some(
      (u) => u.nombre.toLowerCase() === nombre.trim().toLowerCase() && u.idUsuario !== exceptoId,
    );
  }

  crear(d: { nombre: string; correo: string; contrasena: string; rol: Rol }): Observable<Usuario> {
    return this.http
      .post<Usuario>(this.base, {
        nombre: d.nombre.trim(),
        correo: d.correo.trim(),
        contrasena: d.contrasena,
        idRol: ROL_ID[d.rol],
      })
      .pipe(tap(() => this.cargarUsuarios()));
  }

  registrar(nombre: string, correo: string, contrasena: string): Observable<Usuario> {
    return this.crear({ nombre, correo, contrasena, rol: 'USUARIO' });
  }

  actualizar(
    id: number,
    d: { nombre: string; correo: string; rol: Rol; contrasena?: string },
  ): Observable<Usuario> {
    const cuerpo: Record<string, unknown> = {
      nombre: d.nombre.trim(),
      correo: d.correo,
      idRol: ROL_ID[d.rol],
    };
    if (d.contrasena) cuerpo['contrasena'] = d.contrasena;

    return this.http.put<Usuario>(`${this.base}/${id}`, cuerpo).pipe(
      tap((u) => {
        this.cargarUsuarios();
        if (u.idUsuario === this.usuarioActual?.idUsuario) this.iniciarSesion(u);
      }),
    );
  }

  cambiarRol(u: Usuario, rol: Rol): Observable<Usuario> {
    return this.actualizar(u.idUsuario, { nombre: u.nombre, correo: u.correo, rol });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`).pipe(tap(() => this.cargarUsuarios()));
  }

  recuperar(correo: string): Observable<void> {
    return this.http.post<void>(`${this.base}/recuperar`, { correo });
  }
}
