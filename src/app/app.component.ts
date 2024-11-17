import { Component } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    // Prueba de inicialización de Firebase
    try {
      const app = initializeApp(environment.firebase);
      console.log('Firebase inicializado:', app.name);
    } catch (error) {
      console.error('Error al inicializar Firebase:', error);
    }
  }
}
