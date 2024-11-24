import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)

  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginModule)
  },{
    path: 'vendedor',
    loadChildren: () => import('./pages/vendedor/vendedor.module').then( m => m.VendedorModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilModule)
  },
  {
    path: 'admin-panel',
    loadChildren: () => import('./pages/admin-panel/admin-panel.module').then( m => m.AdminModule)
  },
  {
    path: 'modificar',
    loadChildren: () => import('./pages/modificar/modificar.module').then( m => m.ModificarModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
