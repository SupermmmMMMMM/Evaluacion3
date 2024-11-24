import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/firebase/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { User } from 'src/app/models/user.models';

@Component({
  selector: 'app-modificar',
  templateUrl: './modificar.component.html',
  styleUrls: ['./modificar.component.scss']
})
export class ModificarComponent implements OnInit {
  modificarForm: FormGroup;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.modificarForm = this.fb.group({
      nombre: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      telefono: [''],
      direccion: ['']
    });
  }

  ngOnInit() {
    this.authService.getUserState().subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.modificarForm.patchValue({
          nombre: user.nombre,
          email: user.email,
          telefono: user.telefono || '',
          direccion: user.direccion || ''
        });
      }
    });
  }

  async onSubmit() {
    if (this.modificarForm.valid && this.currentUser) {
      const loading = await this.loadingController.create({
        message: 'Actualizando perfil...'
      });
      await loading.present();

      try {
        const updatedData = {
          ...this.currentUser,
          nombre: this.modificarForm.get('nombre')?.value,
          telefono: this.modificarForm.get('telefono')?.value,
          direccion: this.modificarForm.get('direccion')?.value
        };

        await this.authService.updateUserProfile(updatedData);
        await loading.dismiss();
        
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Perfil actualizado correctamente',
          buttons: ['OK']
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