import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../firebase/auth.service';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.auth.user$.pipe(
      take(1),
      map(user => !!user), // Convierte user a booleano
      tap(isLoggedIn => {
        if (!isLoggedIn) {
          console.log('Acceso denegado. Redirigiendo a login...');
          this.router.navigate(['/login'], {
            queryParams: {
              returnUrl: state.url
            }
          });
        }
      })
    );
  }
}