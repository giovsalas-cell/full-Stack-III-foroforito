import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private auth = inject(Auth);
  private router = inject(Router);
  menuAdmin = false;
  usuario$ = this.auth.usuario$;

  salir(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
  buscar(texto: string): void {
    this.router.navigate(['/'], {
      queryParams: { q: texto.trim() || null },
      queryParamsHandling: 'merge',
    });
  }
}
