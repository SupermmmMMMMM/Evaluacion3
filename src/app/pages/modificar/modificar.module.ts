import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { ModificarComponent } from './modificar.component';
import { ModificarRoutingModule } from './modificar-routing.module';

@NgModule({
  declarations: [ModificarComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    ModificarRoutingModule
  ]
})
export class ModificarModule { }