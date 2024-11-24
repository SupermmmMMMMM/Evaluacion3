import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/firebase/auth.service';
import { User } from 'src/app/models/user.models';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  usuario: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.getUserState().subscribe(user => {
      this.usuario = user;
    });
  }

  irAVentas() {
    this.router.navigate(['/vendedor']);
  }

  irAEstadisticas() {
    this.router.navigate(['/admin-panel']);
  }

  modificarDatos() {
    this.router.navigate(['/modificar']);
    console.log('Modificar datos');
  }

  cerrarSesion() {
    this.authService.logout();
  }
}