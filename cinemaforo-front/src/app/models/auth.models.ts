export type Rol = 'ADMIN' | 'USUARIO';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  contrasena: string;
  rol: Rol;
}
