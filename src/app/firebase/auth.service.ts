// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userState = new BehaviorSubject<any>(null);
  user$ = this.userState.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.getUserData(user.uid).subscribe((userData) => {
          this.userState.next({ ...user, ...userData });
        });
      } else {
        this.userState.next(null);
      }
    });
  }

  async register(email: string, password: string, userData: any): Promise<any> {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      if (result.user) {
        await this.setUserData(result.user.uid, {
          ...userData,
          email,
          role: userData.role || 'usuario',
          createdAt: new Date()
        });
        return result;
      }
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async login(email: string, password: string): Promise<any> {
    try {
      return await this.afAuth.signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      this.userState.next(null);
      this.router.navigate(['/auth/login']);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private getUserData(uid: string): Observable<any> {
    return this.firestore.doc(`users/${uid}`).valueChanges();
  }

  private async setUserData(uid: string, data: any): Promise<void> {
    const userRef = this.firestore.doc(`users/${uid}`);
    return userRef.set(data, { merge: true });
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map(user => !!user));
  }

  getUserRole(): Observable<string | null> {
    return this.user$.pipe(map(user => user?.role || null));
  }

  private handleError(error: any): Error {
    let errorMessage = 'Ocurrió un error en la autenticación';

    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Este correo electrónico ya está registrado';
        break;
      case 'auth/invalid-email':
        errorMessage = 'El correo electrónico no es válido';
        break;
      case 'auth/weak-password':
        errorMessage = 'La contraseña debe tener al menos 6 caracteres';
        break;
      case 'auth/user-not-found':
        errorMessage = 'Usuario no encontrado';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Contraseña incorrecta';
        break;
    }

    return new Error(errorMessage);
  }
}
