import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/firebase/auth.service';
import { FirestoreService } from 'src/app/firebase/firestore.service';
import { Venta } from 'src/app/models/venta.models';

@Component({
  selector: 'app-vendedor',
  templateUrl: './vendedor.component.html',
  styleUrls: ['./vendedor.component.scss'],
})
export class VendedorComponent {
  ventaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) {
    this.ventaForm = this.fb.group({
      monto: ['', [Validators.required, Validators.min(1)]],
    });
  }

  async registrarVenta() {
    if (this.ventaForm.valid) {
      const monto = this.ventaForm.value.monto;
      const usuarioId = await this.authService.getUserId();

      if (!usuarioId) {
        console.error('Usuario no está logueado');
        return;
      }

      const venta: Venta = {
        Monto: monto,
        fecha: new Date(),
      };

      try {
        await this.firestoreService.addVenta(venta, usuarioId);
        console.log('Venta registrada correctamente');
      } catch (error) {
        console.error('Error al registrar la venta:', error);
      }
    }
  }
}
