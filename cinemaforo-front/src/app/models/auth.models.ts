export type Rol = 'ADMIN' | 'USUARIO';

// Lo que devuelve ms-usuarios (nunca incluye la contraseña)
export interface Usuario {
  idUsuario: number;
  nombre: string;
  correo: string;
  rol: Rol;
  fechaRegistro: string;
}
