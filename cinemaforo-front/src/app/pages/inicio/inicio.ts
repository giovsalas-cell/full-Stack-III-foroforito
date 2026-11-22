import { Component, inject, signal } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Foro } from '../../services/foro';
import { Auth } from '../../services/auth';
import { Tema } from '../../models/foro.models';
import { mensajeError } from '../../utils/errores';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, AsyncPipe, DatePipe],
  templateUrl: './inicio.html',
})
export class Inicio {
  private foro = inject(Foro);
  private ruta = inject(ActivatedRoute);
  auth = inject(Auth);

  categorias$ = this.foro.categorias$;

  temas = signal<Tema[]>([]);
  cargando = signal(true);
  error = signal('');

  q = signal('');
  cat = signal<number | null>(null);
  populares = signal(false);

  constructor() {
    // Cada vez que cambian ?q= o ?cat= en la URL, se vuelve a pedir la lista
    this.ruta.queryParamMap.subscribe((p) => {
      this.q.set(p.get('q') ?? '');
      this.cat.set(p.get('cat') ? Number(p.get('cat')) : null);
      this.cargar();
    });
  }

  cambiarOrden(populares: boolean): void {
    this.populares.set(populares);
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set('');

    let origen: Observable<Tema[]>;
    if (this.q()) origen = this.foro.buscar(this.q());
    else if (this.cat() !== null) origen = this.foro.porCategoria(this.cat()!);
    else if (this.populares()) origen = this.foro.populares();
    else origen = this.foro.temas();

    origen.subscribe({
      next: (lista) => {
        // En "recientes" se muestran primero los más nuevos
        const ordenada = this.populares()
          ? lista
          : [...lista].sort((a, b) => b.fecha.localeCompare(a.fecha));
        this.temas.set(ordenada);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(mensajeError(e));
        this.cargando.set(false);
      },
    });
  }

  autor(t: Tema): string {
    return this.auth.nombreDe(t.idUsuario);
  }
}
