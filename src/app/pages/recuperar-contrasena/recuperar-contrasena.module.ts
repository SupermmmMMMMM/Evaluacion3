import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RecuperarContrasenaRoutingModule } from './recuperar-contrasena-routing.module';
import { RecuperarContrasenaComponent } from './recuperar-contrasena.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RecuperarContrasenaRoutingModule
  ],
  declarations: [RecuperarContrasenaComponent]
})
export class RecuperarContrasenaModule {}