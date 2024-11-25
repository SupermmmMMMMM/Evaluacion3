// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.models';  // Importamos la interfaz User
import { Venta } from '../models/venta.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userState = new BehaviorSubject<User | null>(null);  // Definimos el tipo como User o null
  user$ = this.userState.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.getUserData(user.uid).subscribe((userData: User) => {  // Esperamos un User
          this.userState.next({ ...user, ...userData });  // Fusionamos el user con los datos adicionales
        });
      } else {
        this.userState.next(null);
      }
    });
  }

  async updateUserProfile(userData: Partial<User>): Promise<void> {
    try {
      const userId = await this.getUserId();
      if (!userId) throw new Error('No hay usuario autenticado');

      await this.firestore.doc(`users/${userId}`).update({
        nombre: userData.nombre,
        telefono: userData.telefono,
        direccion: userData.direccion
      });
      
      // Actualizar el estado del usuario
      const currentUser = this.userState.value;
      if (currentUser) {
        this.userState.next({
          ...currentUser,
          ...userData
        });
      }
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
  // Método para obtener el estado del usuario
  getUserState(): Observable<User | null> {
    return this.user$;
  }

  // Método para registrar a un nuevo usuario
  async register(email: string, password: string, userData: Partial<User>): Promise<any> {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      if (result.user) {
        const user: User = {
          uid: result.user.uid,
          email,
          role: userData.role || 'usuario',  // Asignar el rol
          createdAt: new Date(),  // Fecha de creación
          nombre: userData.nombre
        };

        // Guardamos los datos del usuario en Firestore
        await this.setUserData(result.user.uid, user);

        // Crear subcolección 'Ventas' con un documento inicial 'inicio'


        return result;
      }
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
  // Método para obtener el ID del usuario actual
  async getUserId(): Promise<string | null> {
    const user = await this.afAuth.currentUser;
    return user ? user.uid : null;
  }

  // Método para agregar una venta
  async addVenta(monto: number): Promise<void> {
    try {
      const userId = await this.getUserId();
      if (userId) {
        const ventaRef = this.firestore.doc(`users/${userId}/Ventas/inicio`);

        await this.firestore.firestore.runTransaction(async (transaction) => {
          const doc = await transaction.get(ventaRef.ref);
          if (!doc.exists) {
            throw "El documento no existe!";

          } const ventaData = doc.data() as Venta;  // Aquí indicamos que los datos son de tipo 'Venta'
            const newMonto = ventaData.Monto + monto;
            transaction.update(ventaRef.ref, { Monto: newMonto });
        });
      }
    } catch (error: any) {
      console.error("Error al registrar la venta:", error);
    }
  }

  // Método de login
  async login(email: string, password: string): Promise<any> {
    try {
      return await this.afAuth.signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Método para hacer logout
  async logout(): Promise<void> {
    try {
      await this.afAuth.setPersistence('none');  // Limpiar la persistencia antes de cerrar sesión
      await this.afAuth.signOut();
      this.userState.next(null);
      await this.router.navigate(['/login']);
      window.location.reload();  // Esto asegura que la página se recargue
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
  // Obtener los datos del usuario desde Firestore
  private getUserData(uid: string): Observable<User> {
    return this.firestore.doc(`users/${uid}`).valueChanges() as Observable<User>;
  }

  // Guardar los datos del usuario en Firestore
  private async setUserData(uid: string, data: User): Promise<void> {
    const userRef = this.firestore.doc(`users/${uid}`);
    return userRef.set(data, { merge: true });
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map(user => !!user));
  }

  // Obtener el rol del usuario
  getUserRole(): Observable<string | null> {
    return this.user$.pipe(map(user => user?.role || null));
  }

  // Manejar errores de autenticación
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
