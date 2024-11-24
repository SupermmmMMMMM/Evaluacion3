import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <ion-footer class="ion-no-border">
      <ion-toolbar color="primary">
        <div class="footer-content">
          <p>© 2024 Almacén Daniella - Todos los derechos reservados</p>
        </div>
      </ion-toolbar>
    </ion-footer>
  `,
  styles: [`
    :host {
      display: block;
    }
  
    ion-toolbar {
      --background: #002855;
      --color: white;
    }
  
    .footer-content {
      text-align: center;
      padding: 10px;
      font-size: 14px;
      color: white;
    }
  
    @media (max-width: 768px) {
      .footer-content {
        font-size: 12px;
        padding: 8px;
      }
    }
  `]
})
export class FooterComponent {}