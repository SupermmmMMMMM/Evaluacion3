import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/firebase/auth.service';
import { FirestoreService } from 'src/app/firebase/firestore.service';
import { Venta } from 'src/app/models/venta.models';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-vendedor',
  templateUrl: './vendedor.component.html',
  styleUrls: ['./vendedor.component.scss'],
})
export class VendedorComponent implements OnInit {
  ventaForm: FormGroup;
  devolucionForm: FormGroup;
  totalVentasDiarias: number = 0;
  mostrarDevolucion: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private alertController: AlertController
  ) {
    this.ventaForm = this.fb.group({
      monto: ['', [Validators.required, Validators.min(1)]],
    });
    this.devolucionForm = this.fb.group({
      monto: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    this.cargarVentasDiarias();
  }

  async cargarVentasDiarias() {
    const usuarioId = await this.authService.getUserId();
    if (usuarioId) {
      this.firestoreService.getTotalVentas(usuarioId).subscribe(venta => {
        this.totalVentasDiarias = venta?.Monto || 0;
      });
    }
  }

  async registrarVenta() {
    if (this.ventaForm.valid) {
      const monto = this.ventaForm.value.monto;
      const usuarioId = await this.authService.getUserId();

      if (!usuarioId) {
        await this.mostrarAlerta('Error', 'Usuario no está logueado');
        return;
      }

      const venta: Venta = {
        Monto: monto,
        fecha: new Date(),
      };

      try {
        await this.firestoreService.addVenta(venta, usuarioId);
        await this.mostrarAlerta('Éxito', 'Venta registrada correctamente');
        this.ventaForm.reset();
      } catch (error) {
        await this.mostrarAlerta('Error', 'Error al registrar la venta');
      }
    }
  }

  async registrarDevolucion() {
    if (this.devolucionForm.valid) {
      const monto = -this.devolucionForm.value.monto; // Negativo para restar
      const usuarioId = await this.authService.getUserId();

      if (!usuarioId) {
        await this.mostrarAlerta('Error', 'Usuario no está logueado');
        return;
      }

      const venta: Venta = {
        Monto: monto,
        fecha: new Date(),
      };

      try {
        await this.firestoreService.addVenta(venta, usuarioId);
        await this.mostrarAlerta('Éxito', 'Devolución registrada correctamente');
        this.devolucionForm.reset();
        this.mostrarDevolucion = false;
      } catch (error) {
        await this.mostrarAlerta('Error', 'Error al registrar la devolución');
      }
    }
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  toggleDevolucion() {
    this.mostrarDevolucion = !this.mostrarDevolucion;
  }
}