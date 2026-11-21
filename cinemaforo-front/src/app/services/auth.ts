import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Rol, Usuario } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class Auth {
  private usuarios: Usuario[] = [
    {
      id: 1,
      nombre: 'admin',
      correo: 'admin@cinemaforo.cl',
      contrasena: 'Admin123!',
      rol: 'ADMIN',
    },
    {
      id: 2,
      nombre: 'cinefilo_cl',
      correo: 'cine@cinemaforo.cl',
      contrasena: 'Cine1234!',
      rol: 'USUARIO',
    },
    {
      id: 3,
      nombre: 'maratonero',
      correo: 'mara@cinemaforo.cl',
      contrasena: 'Mara1234!',
      rol: 'USUARIO',
    },
  ];

  private usuarioSubject = new BehaviorSubject<Usuario | null>(this.leerSesion());
  readonly usuario$ = this.usuarioSubject.asObservable();

  get usuarioActual(): Usuario | null {
    return this.usuarioSubject.value;
  }

  get esAdmin(): boolean {
    return this.usuarioActual?.rol === 'ADMIN';
  }

  login(correo: string, contrasena: string): boolean {
    const u = this.usuarios.find(
      (x) => x.correo.toLowerCase() === correo.trim().toLowerCase() && x.contrasena === contrasena,
    );
    if (!u) return false;
    this.usuarioSubject.next(u);
    sessionStorage.setItem('cf_usuario', String(u.id));
    return true;
  }

  logout(): void {
    this.usuarioSubject.next(null);
    sessionStorage.removeItem('cf_usuario');
  }

  correoExiste(correo: string): boolean {
    return this.usuarios.some((u) => u.correo.toLowerCase() === correo.trim().toLowerCase());
  }

  nombreExiste(nombre: string): boolean {
    return this.usuarios.some((u) => u.nombre.toLowerCase() === nombre.trim().toLowerCase());
  }

  registrar(nombre: string, correo: string, contrasena: string): boolean {
    if (this.correoExiste(correo) || this.nombreExiste(nombre)) return false;
    const nuevo: Usuario = {
      id: Math.max(0, ...this.usuarios.map((u) => u.id)) + 1,
      nombre: nombre.trim(),
      correo: correo.trim(),
      contrasena,
      rol: 'USUARIO' as Rol,
    };
    this.usuarios.push(nuevo);
    return true;
  }

  // Simula el envío del correo de recuperación
  recuperar(correo: string): boolean {
    return this.correoExiste(correo);
  }

  actualizarPerfil(nombre: string, nuevaContrasena?: string): void {
    const actual = this.usuarioActual;
    if (!actual) return;
    const actualizado: Usuario = {
      ...actual,
      nombre: nombre.trim(),
      contrasena: nuevaContrasena ? nuevaContrasena : actual.contrasena,
    };
    this.usuarios = this.usuarios.map((u) => (u.id === actual.id ? actualizado : u));
    this.usuarioSubject.next(actualizado);
  }

  private leerSesion(): Usuario | null {
    const id = Number(sessionStorage.getItem('cf_usuario'));
    return this.usuarios.find((u) => u.id === id) ?? null;
  }
}
