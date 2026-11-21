import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { Foro } from '../../services/foro';

@Component({
  selector: 'app-inicio',
  imports: [AsyncPipe, DatePipe, RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  private foro = inject(Foro);
  private route = inject(ActivatedRoute);

  categorias = this.foro.categorias;

  // Filtros que vienen en la URL: ?q=texto&cat=id
  private filtros$ = this.route.queryParamMap.pipe(
    map((p) => ({
      q: (p.get('q') ?? '').trim().toLowerCase(),
      cat: Number(p.get('cat') ?? 0),
    })),
  );

  catActual$ = this.filtros$.pipe(map((f) => f.cat));
  textoBusqueda$ = this.route.queryParamMap.pipe(map((p) => p.get('q') ?? ''));

  // Solo temas ACTIVOS: los baneados no se muestran
  private activos$ = this.foro.temas$.pipe(
    map((lista) => lista.filter((t) => t.estado === 'ACTIVO')),
  );

  // Temas filtrados por categoría y por texto (título o contenido)
  temas$ = combineLatest([this.activos$, this.filtros$]).pipe(
    map(([lista, f]) =>
      lista.filter(
        (t) =>
          (f.cat === 0 || t.idCategoria === f.cat) &&
          (!f.q || t.titulo.toLowerCase().includes(f.q) || t.contenido.toLowerCase().includes(f.q)),
      ),
    ),
  );

  // Los 3 más votados
  populares$ = this.activos$.pipe(
    map((lista) => [...lista].sort((a, b) => b.votos - a.votos).slice(0, 3)),
  );

  nombreCategoria(id: number): string {
    return this.categorias.find((c) => c.id === id)?.nombre ?? '';
  }

  miVoto(id: number): number {
    return this.foro.miVoto(id);
  }

  votar(id: number, voto: 1 | -1): void {
    this.foro.votarTema(id, voto);
  }
}
