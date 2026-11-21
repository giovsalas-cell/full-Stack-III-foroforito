import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Categoria, Comentario, Tema } from '../models/foro.models';

@Injectable({ providedIn: 'root' })
export class Foro {
  readonly categorias: Categoria[] = [
    {
      id: 1,
      nombre: 'Películas',
      descripcion: 'Estrenos, clásicos y debates sobre largometrajes.',
    },
    { id: 2, nombre: 'Series', descripcion: 'Todo sobre series y temporadas.' },
    { id: 3, nombre: 'Directores', descripcion: 'Autores y estilos de dirección.' },
    { id: 4, nombre: 'Recomendaciones', descripcion: 'Qué ver este fin de semana.' },
    { id: 5, nombre: 'Noticias', descripcion: 'Novedades de la industria.' },
  ];
  private misVotos: Record<number, 1 | -1> = {};
  private temasSubject = new BehaviorSubject<Tema[]>([
    {
      id: 1,
      titulo: 'Teorías sobre el final de Inception',
      contenido: '¿Seguía soñando Cobb o era real? Cuéntame tu teoría.',
      fecha: '2026-11-18T20:10:00',
      estado: 'ACTIVO',
      idUsuario: 2,
      autor: 'cinefilo_cl',
      idCategoria: 1,
      votos: 128,
    },
    {
      id: 2,
      titulo: 'La mejor temporada de una serie, según tú',
      contenido: 'Para mí es la 4 de Breaking Bad. ¿La tuya?',
      fecha: '2026-11-19T09:30:00',
      estado: 'ACTIVO',
      idUsuario: 3,
      autor: 'maratonero',
      idCategoria: 2,
      votos: 87,
    },
    {
      id: 3,
      titulo: 'Nolan vs Villeneuve: ¿quién dirige mejor?',
      contenido: 'Los dos hacen cine a gran escala, pero con estilos muy distintos.',
      fecha: '2026-11-19T18:45:00',
      estado: 'ACTIVO',
      idUsuario: 2,
      autor: 'cinefilo_cl',
      idCategoria: 3,
      votos: 64,
    },
    {
      id: 4,
      titulo: 'Recomiéndenme ciencia ficción para el finde',
      contenido: 'Ya vi Blade Runner y Arrival, quiero algo parecido.',
      fecha: '2026-11-20T11:00:00',
      estado: 'ACTIVO',
      idUsuario: 3,
      autor: 'maratonero',
      idCategoria: 4,
      votos: 41,
    },
    {
      id: 5,
      titulo: 'Se anuncia nueva película de culto restaurada en 4K',
      contenido: 'Vuelve a salas con sonido remasterizado.',
      fecha: '2026-11-20T14:20:00',
      estado: 'ACTIVO',
      idUsuario: 1,
      autor: 'admin',
      idCategoria: 5,
      votos: 22,
    },
    {
      id: 6,
      titulo: 'Spoilers sin aviso en este tema',
      contenido: 'Contenido que incumple las normas del foro.',
      fecha: '2026-11-20T15:00:00',
      estado: 'BANEADO',
      idUsuario: 3,
      autor: 'maratonero',
      idCategoria: 1,
      votos: 0,
    },
  ]);

  private comentariosSubject = new BehaviorSubject<Comentario[]>([
    {
      id: 1,
      idTema: 1,
      idPadre: null,
      autor: 'maratonero',
      contenido: 'Yo creo que seguía soñando, el trompo nunca cae.',
      fecha: '2026-11-18T21:00:00',
      estado: 'ACTIVO',
      votos: 12,
    },
    {
      id: 2,
      idTema: 1,
      idPadre: 1,
      autor: 'cinefilo_cl',
      contenido: 'Pero Cobb ni mira el trompo al final, eso es lo importante.',
      fecha: '2026-11-18T21:15:00',
      estado: 'ACTIVO',
      votos: 8,
    },
    {
      id: 3,
      idTema: 1,
      idPadre: null,
      autor: 'admin',
      contenido: 'Recuerden no spoilear otras películas en este hilo.',
      fecha: '2026-11-18T22:00:00',
      estado: 'ACTIVO',
      votos: 5,
    },
    {
      id: 4,
      idTema: 2,
      idPadre: null,
      autor: 'cinefilo_cl',
      contenido: 'Sin duda la 3 de Better Call Saul.',
      fecha: '2026-11-19T10:00:00',
      estado: 'ACTIVO',
      votos: 4,
    },
  ]);

  // Observables que los componentes escuchan (patrón Observer)
  readonly temas$ = this.temasSubject.asObservable();
  readonly comentarios$ = this.comentariosSubject.asObservable();

  miVoto(id: number): 0 | 1 | -1 {
    return this.misVotos[id] ?? 0;
  }

  votarTema(id: number, voto: 1 | -1): void {
    const anterior = this.misVotos[id] ?? 0;
    const nuevo = anterior === voto ? 0 : voto; // repetir el mismo voto lo quita
    const cambio = nuevo - anterior;

    if (nuevo === 0) {
      delete this.misVotos[id];
    } else {
      this.misVotos[id] = nuevo;
    }

    this.temasSubject.next(
      this.temasSubject.value.map((t) => (t.id === id ? { ...t, votos: t.votos + cambio } : t)),
    );
  }

  cambiarEstadoTema(id: number, estado: 'ACTIVO' | 'BANEADO'): void {
    this.temasSubject.next(
      this.temasSubject.value.map((t) => (t.id === id ? { ...t, estado } : t)),
    );
  }

  cambiarEstadoComentario(id: number, estado: 'ACTIVO' | 'BANEADO'): void {
    this.comentariosSubject.next(
      this.comentariosSubject.value.map((c) => (c.id === id ? { ...c, estado } : c)),
    );
  }
  obtenerTema(id: number): Tema | undefined {
    return this.temasSubject.value.find((t) => t.id === id);
  }

  categoriaNombre(id: number): string {
    return this.categorias.find((c) => c.id === id)?.nombre ?? '';
  }
  crearTema(
    datos: Pick<Tema, 'titulo' | 'contenido' | 'idCategoria' | 'idUsuario' | 'autor'>,
  ): number {
    const lista = this.temasSubject.value;
    const nuevo: Tema = {
      ...datos,
      id: Math.max(0, ...lista.map((t) => t.id)) + 1,
      fecha: new Date().toISOString(),
      estado: 'ACTIVO',
      votos: 0,
    };
    this.temasSubject.next([nuevo, ...lista]);
    return nuevo.id;
  }

  comentar(idTema: number, idPadre: number | null, autor: string, contenido: string): void {
    const lista = this.comentariosSubject.value;
    const nuevo: Comentario = {
      id: Math.max(0, ...lista.map((c) => c.id)) + 1,
      idTema,
      idPadre,
      autor,
      contenido,
      fecha: new Date().toISOString(),
      estado: 'ACTIVO',
      votos: 0,
    };
    this.comentariosSubject.next([...lista, nuevo]);
  }
}
