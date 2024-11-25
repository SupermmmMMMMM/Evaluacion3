import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/firebase/auth.service';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.scss']
})
export class RecuperarContrasenaComponent {
  recoverForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) {
    this.recoverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onRecover() {
    if (this.recoverForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Enviando correo de recuperación...'
      });
      await loading.present();

      try {
        const { email } = this.recoverForm.value;
        await this.authService.resetPassword(email);
        await loading.dismiss();
        
        const alert = await this.alertController.create({
          header: 'Correo enviado',
          message: 'Se ha enviado un correo con las instrucciones para recuperar tu contraseña.',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.router.navigate(['/login']);
              }
            }
          ]
        });
        await alert.present();

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