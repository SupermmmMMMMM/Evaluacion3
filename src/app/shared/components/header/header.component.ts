import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/firebase/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.models';

@Component({
  selector: 'app-header',
  template: `
    <ion-header class="ion-no-border" *ngIf="usuario">
    <ion-toolbar color="primary">
      <ion-title>
        <div class="logo-container">
          <img src="assets/logo-almacen.png" alt="Almacén Daniella" class="logo">
        </div>
      </ion-title>

        <!-- Botones para pantallas grandes -->
        <ion-buttons slot="end" class="ion-hide-md-down">
          <ng-container *ngIf="usuario">
            <!-- Menú para Administrador -->
            <ng-container *ngIf="usuario.role === 'Administrador'">
              <ion-button fill="clear" routerLink="/perfil">
                <ion-icon slot="start" name="person-outline"></ion-icon>
                Perfil
              </ion-button>
              <ion-button fill="clear" routerLink="/admin-panel">
                <ion-icon slot="start" name="stats-chart-outline"></ion-icon>
                Estadísticas
              </ion-button>
            </ng-container>
            
            <!-- Menú para Vendedor -->
            <ng-container *ngIf="usuario.role === 'Vendedor'">
              <ion-button fill="clear" routerLink="/perfil">
                <ion-icon slot="start" name="person-outline"></ion-icon>
                Perfil
              </ion-button>
              <ion-button fill="clear" routerLink="/vendedor">
                <ion-icon slot="start" name="cart-outline"></ion-icon>
                Ingresar Venta
              </ion-button>
            </ng-container>
            
            <ion-button fill="clear" (click)="cerrarSesion()">
              <ion-icon slot="start" name="log-out-outline"></ion-icon>
              Cerrar Sesión
            </ion-button>
          </ng-container>
        </ion-buttons>

        <!-- Menú para pantallas pequeñas -->
        <ion-buttons slot="end" class="ion-hide-md-up">
          <ion-button (click)="presentPopover($event)" *ngIf="usuario">
            <ion-icon slot="icon-only" name="menu-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <!-- Menú lateral para dispositivos móviles -->
    <ion-menu side="start" menuId="first" contentId="main">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Menú</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list *ngIf="usuario">
          <!-- Opciones para Administrador -->
          <ng-container *ngIf="usuario.role === 'Administrador'">
            <ion-item button routerLink="/perfil" routerDirection="root">
              <ion-icon slot="start" name="person-outline"></ion-icon>
              <ion-label>Perfil</ion-label>
            </ion-item>
            <ion-item button routerLink="/admin-panel" routerDirection="root">
              <ion-icon slot="start" name="stats-chart-outline"></ion-icon>
              <ion-label>Estadísticas</ion-label>
            </ion-item>
          </ng-container>

          <!-- Opciones para Vendedor -->
          <ng-container *ngIf="usuario.role === 'Vendedor'">
            <ion-item button routerLink="/perfil" routerDirection="root">
              <ion-icon slot="start" name="person-outline"></ion-icon>
              <ion-label>Perfil</ion-label>
            </ion-item>
            <ion-item button routerLink="/vendedor" routerDirection="root">
              <ion-icon slot="start" name="cart-outline"></ion-icon>
              <ion-label>Ingresar Venta</ion-label>
            </ion-item>
          </ng-container>

          <ion-item button (click)="cerrarSesion()">
            <ion-icon slot="start" name="log-out-outline"></ion-icon>
            <ion-label>Cerrar Sesión</ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-menu>
  `,
  styles: [`

    ion-toolbar {
    --background: #002855;
    --color: white;
    padding: 10px 20px;
    height: 70px;
  }

  .logo-container {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 5px 0;
  }

  .logo {
    height: 40px;
    width: auto;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    ion-toolbar {
      height: 60px;
    }
    
    .logo-container {
      height: 40px;
    }
    
    .logo {
      height: 30px;
    }
  }
  
    ion-button {
      --color: white;
      --background: transparent;
      --background-hover: rgba(255, 255, 255, 0.1);
      --background-activated: rgba(255, 255, 255, 0.2);
      font-size: 14px;
    }
  
    ion-button ion-icon {
      font-size: 20px;
      margin-right: 5px;
    }
  
    @media (max-width: 768px) {
      .logo {
        height: 25px;
      }
    }
  
    // Estilos para el menú lateral
    ion-menu ion-content {
      --background: #002855;
    }
  
    ion-menu ion-toolbar {
      --background: #002855;
      --color: white;
    }
  
    ion-menu ion-item {
      --background: #002855;
      --color: white;
      --padding-start: 16px;
      --padding-end: 16px;
      --background-hover: rgba(255, 255, 255, 0.1);
      --background-activated: rgba(255, 255, 255, 0.2);
    }
  
    ion-menu ion-item ion-icon {
      color: white;
      font-size: 24px;
      margin-right: 8px;
    }
  
    ion-menu ion-list {
      background: #002855;
    }
  `]
})
export class HeaderComponent implements OnInit {
  usuario: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.getUserState().subscribe(user => {
      this.usuario = user;
    });
  }

  cerrarSesion() {
    this.authService.logout();
  }

  async presentPopover(ev: any) {
    const menu = document.querySelector('ion-menu');
    if (menu) {
      menu.open();
    }
  }
}