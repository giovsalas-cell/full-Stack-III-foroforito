export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Tema {
  id: number;
  titulo: string;
  contenido: string;
  fecha: string;
  estado: 'ACTIVO' | 'BANEADO';
  idUsuario: number;
  autor: string;
  idCategoria: number;
  votos: number;
}

export interface Comentario {
  id: number;
  idTema: number;
  idPadre: number | null; // null = comentario principal; número = respuesta
  autor: string;
  contenido: string;
  fecha: string;
  estado: 'ACTIVO' | 'BANEADO';
  votos: number;
}
