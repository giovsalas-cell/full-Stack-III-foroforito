import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { Recuperar } from './pages/recuperar/recuperar';
import { Perfil } from './pages/perfil/perfil';
import { TemaDetalle } from './pages/tema-detalle/tema-detalle';
import { NuevoTema } from './pages/nuevo-tema/nuevo-tema';
import { AdminTemas } from './pages/admin-temas/admin-temas';
import { AdminComentarios } from './pages/admin-comentarios/admin-comentarios';
import { AdminUsuarios } from './pages/admin-usuarios/admin-usuarios';
import { soloAdmin, soloLogueados } from './guards/guards';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'recuperar', component: Recuperar },
  { path: 'tema/:id', component: TemaDetalle },

  // Requieren sesión
  { path: 'perfil', component: Perfil, canActivate: [soloLogueados] },
  { path: 'nuevo-tema', component: NuevoTema, canActivate: [soloLogueados] },

  // Solo administrador
  { path: 'admin', pathMatch: 'full', redirectTo: 'admin/temas' },
  { path: 'admin/temas', component: AdminTemas, canActivate: [soloAdmin] },
  { path: 'admin/comentarios', component: AdminComentarios, canActivate: [soloAdmin] },
  { path: 'admin/usuarios', component: AdminUsuarios, canActivate: [soloAdmin] },

  { path: '**', redirectTo: '' },
];
