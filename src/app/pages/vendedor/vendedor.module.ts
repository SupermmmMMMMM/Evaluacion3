import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendedorRoutingModule } from './vendedor-routing.module';
import { VendedorComponent } from './vendedor.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [VendedorComponent],
  imports: [
    CommonModule,
    VendedorRoutingModule,IonicModule,FormsModule,ReactiveFormsModule


  ]
})
export class VendedorModule { }
