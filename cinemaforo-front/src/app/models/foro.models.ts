// Formas que devuelve ms-foro (coinciden con los DTO del backend)
export interface Categoria {
  idCategoria: number;
  nombre: string;
  descripcion: string;
}

export interface Tema {
  idTema: number;
  titulo: string;
  contenido: string;
  fecha: string;
  estado: string;
  idUsuario: number;
  categoria: string;
  totalComentarios: number;
}

export interface Comentario {
  idComentario: number;
  contenido: string;
  fecha: string;
  estado: string;
  idUsuario: number;
  idTema: number;
}

// Lo que se envía al publicar un tema
export interface TemaNuevo {
  titulo: string;
  contenido: string;
  idUsuario: number;
  idCategoria: number;
}
