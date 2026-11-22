export type EstadoAdmin = 'ACTIVO' | 'BANEADO';

export interface TemaAdmin {
  idTema: number;
  titulo: string;
  estado: EstadoAdmin;
  idUsuario: number;
}

export interface ComentarioAdmin {
  idComentario: number;
  contenido: string;
  estado: EstadoAdmin;
  idUsuario: number;
  idTema: number;
}
