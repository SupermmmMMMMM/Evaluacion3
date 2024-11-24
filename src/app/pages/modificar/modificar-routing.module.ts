import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarComponent } from './modificar.component';

const routes: Routes = [
  {
    path: '',
    component: ModificarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarRoutingModule {}
