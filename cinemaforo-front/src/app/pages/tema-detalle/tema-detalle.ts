import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { Foro } from '../../services/foro';
import { Comentario } from '../../models/foro.models';

interface ComentarioNivel extends Comentario {
  nivel: number; // 0 = comentario principal, 1+ = respuestas
}

@Component({
  selector: 'app-tema-detalle',
  imports: [AsyncPipe, DatePipe, RouterLink, FormsModule],
  templateUrl: './tema-detalle.html',
  styleUrl: './tema-detalle.css',
})
export class TemaDetalle {
  private foro = inject(Foro);
  private route = inject(ActivatedRoute);

  idTema = Number(this.route.snapshot.paramMap.get('id'));
  autor = 'invitado'; // más adelante vendrá del usuario logueado

  nuevoComentario = '';
  respondiendoA: number | null = null;
  textoRespuesta = '';

  // Solo se muestra si existe y está ACTIVO (un tema baneado no se ve)
  tema$ = this.foro.temas$.pipe(
    map((lista) => lista.find((t) => t.id === this.idTema && t.estado === 'ACTIVO')),
  );

  // Comentarios ACTIVOS de este tema, ordenados como hilo
  comentarios$ = this.foro.comentarios$.pipe(
    map((lista) =>
      this.ordenarHilo(lista.filter((c) => c.idTema === this.idTema && c.estado === 'ACTIVO')),
    ),
  );

  // Pone cada respuesta justo debajo de su comentario padre
  private ordenarHilo(lista: Comentario[]): ComentarioNivel[] {
    const resultado: ComentarioNivel[] = [];
    const agregar = (idPadre: number | null, nivel: number) => {
      lista
        .filter((c) => c.idPadre === idPadre)
        .forEach((c) => {
          resultado.push({ ...c, nivel });
          agregar(c.id, nivel + 1);
        });
    };
    agregar(null, 0);
    return resultado;
  }

  nombreCategoria(id: number): string {
    return this.foro.categoriaNombre(id);
  }

  miVoto(): number {
    return this.foro.miVoto(this.idTema);
  }

  votar(voto: 1 | -1): void {
    this.foro.votarTema(this.idTema, voto);
  }

  publicar(): void {
    const texto = this.nuevoComentario.trim();
    if (!texto) return;
    this.foro.comentar(this.idTema, null, this.autor, texto);
    this.nuevoComentario = '';
  }

  abrirRespuesta(idComentario: number): void {
    this.respondiendoA = idComentario;
    this.textoRespuesta = '';
  }

  cancelarRespuesta(): void {
    this.respondiendoA = null;
    this.textoRespuesta = '';
  }

  enviarRespuesta(idPadre: number): void {
    const texto = this.textoRespuesta.trim();
    if (!texto) return;
    this.foro.comentar(this.idTema, idPadre, this.autor, texto);
    this.cancelarRespuesta();
  }
}
