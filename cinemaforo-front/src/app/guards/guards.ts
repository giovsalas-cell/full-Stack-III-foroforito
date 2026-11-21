import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

// Páginas que piden haber iniciado sesión
export const soloLogueados: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  return auth.usuarioActual ? true : router.createUrlTree(['/login']);
};

// Páginas solo para el administrador
export const soloAdmin: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  if (!auth.usuarioActual) return router.createUrlTree(['/login']);
  return auth.esAdmin ? true : router.createUrlTree(['/']);
};
