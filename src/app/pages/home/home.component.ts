
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/firebase/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inicio',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent {
  inicioForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) {
    this.inicioForm = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['Vendedor', [Validators.required]]
    });
  }

  async onSubmit() {
    if (this.inicioForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Registrando...'
      });
      await loading.present();

      try {
        const { email, password, nombre, role } = this.inicioForm.value;
        await this.authService.register(email, password, { nombre, role });
        await loading.dismiss();
        this.router.navigate(['/perfil']);
      } catch (error: any) {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: error.message,
          buttons: ['OK']
        });
        await alert.present();
      }
    }
  }
}
