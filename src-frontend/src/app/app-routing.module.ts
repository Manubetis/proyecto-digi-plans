import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { HomeComponent } from './components/home/home.component';
import { HomeUsuarioNoRegistradoComponent } from './components/home-usuario-no-registrado/home-usuario-no-registrado.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';

import { AuthGuard } from '../app/guards/auth.guard';
import { CrearEventosComponent } from './components/home/crear-eventos/crear-eventos.component';
import { DetallesComponent } from './components/home/detalles/detalles.component';
import { EditarEventosComponent } from './components/home/editar-eventos/editar-eventos/editar-eventos.component';

const routes: Routes = [
  { path: '', redirectTo: '/homeUsuarioNoRegistrado', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'homeUsuarioNoRegistrado', component: HomeUsuarioNoRegistradoComponent },
  { path: 'crear-eventos', component: CrearEventosComponent, canActivate: [AuthGuard] },
  { path: 'detalles/:id', component: DetallesComponent, canActivate: [AuthGuard] },
  { path: 'editar-evento/:id', component: EditarEventosComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
