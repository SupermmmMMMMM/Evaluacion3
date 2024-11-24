import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PerfilComponent } from './perfil.component';
import { PerfilPageRoutingModule } from './perfil-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PerfilPageRoutingModule,
    SharedModule
  ],
  declarations: [PerfilComponent]
})
export class PerfilModule {}