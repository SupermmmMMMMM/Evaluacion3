import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, Observable } from 'rxjs';
import { Venta } from 'src/app/models/venta.models';
import {  VentaSemanal } from 'src/app/models/venta-semanal.models'; // Importamos las nuevas interfaces
import { VentasMensuales} from 'src/app//models/ventas-mensuales.models';
import { map,switchMap } from 'rxjs/operators';
import { User } from '../models/user.models';

interface VendedorVentas extends User {
  ventasDiarias?: number;
  ventasSemanales?: number;
}

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  getVentasMensuales(): Observable<VentasMensuales[]> {
    return this.firestore
      .collection<VentasMensuales>('VentasMensuales', (ref) => ref.orderBy('fechaInicio', 'desc'))
      .valueChanges()
      .pipe(
        map((ventas) =>
          ventas.map((venta) => ({
            ...venta,
            fechaInicio: (venta.fechaInicio as any).toDate(),
            fechaFin: (venta.fechaFin as any).toDate(),
            fechaActualizacion: (venta.fechaActualizacion as any).toDate(),
          }))
        )
      );
  }

  constructor(private firestore: AngularFirestore) {}


  async actualizarVentasMensuales(venta: Venta): Promise<void> {
    try {
      const fecha = new Date();
      const year = fecha.getFullYear();
      const mes = fecha.getMonth() + 1; // Los meses en JavaScript son base 0
      const mesId = `mes${mes}-${year}`; // ID único para cada mes

      // Referencia al documento del mes actual en la colección VentasMensuales
      const mensualRef = this.firestore.doc<VentasMensuales>(`VentasMensuales/${mesId}`);
      const mensualDoc = await mensualRef.get().toPromise();

      if (mensualDoc.exists) {
        // Si el documento existe, actualizamos el monto
        const mensualData = mensualDoc.data() as VentasMensuales;
        await mensualRef.update({
          Monto: mensualData.Monto + venta.Monto,
          fechaActualizacion: new Date(),
        });
      } else {
        // Si no existe, creamos un nuevo documento para este mes
        await mensualRef.set({
          Monto: venta.Monto,
          fechaInicio: this.obtenerInicioMes(fecha),
          fechaFin: this.obtenerFinMes(fecha),
          fechaActualizacion: new Date(),
        });
      }

      console.log('Ventas mensuales actualizadas exitosamente');
    } catch (error) {
      console.error('Error al actualizar ventas mensuales:', error);
      throw error;
    }
  }

  private obtenerInicioMes(fecha: Date): Date {
    const inicio = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
    inicio.setHours(0, 0, 0, 0);
    return inicio;
  }

  private obtenerFinMes(fecha: Date): Date {
    const fin = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
    fin.setHours(23, 59, 59, 999);
    return fin;
  }


  // Método para agregar una venta y actualizar totales
  async addVenta(venta: Venta, usuarioId: string): Promise<void> {
    try {
      // 1. Actualizar el total general
      const totalRef = this.firestore.doc<Venta>(`users/${usuarioId}/Ventas/total`);
      const totalDoc = await totalRef.get().toPromise();
      const totalData = totalDoc.data() as Venta | undefined;

      if (totalDoc.exists) {
        const MontoActual = totalData?.Monto || 0;
        await totalRef.update({
          Monto: MontoActual + venta.Monto,
          fecha: new Date(),
        });
      } else {
        await totalRef.set({
          Monto: venta.Monto,
          fecha: new Date(),
        });
      }



      // 2. Actualizar el total semanal
      const fecha = new Date();
      const numeroSemana = this.obtenerNumeroSemana(fecha);
      const year = fecha.getFullYear();
      const semanaId = `semana${numeroSemana}-${year}`; // ID único para la semana

      const semanalRef = this.firestore.doc<VentaSemanal>(`users/${usuarioId}/VentasSemanales/${semanaId}`);
      const semanalDoc = await semanalRef.get().toPromise();

      if (semanalDoc.exists) {
        const semanalData = semanalDoc.data() as VentaSemanal;
        await semanalRef.update({
          Monto: semanalData.Monto + venta.Monto,
          fechaActualizacion: new Date(),
        });
      } else {
        await semanalRef.set({
          Monto: venta.Monto,
          fechaInicio: this.obtenerInicioSemana(fecha),
          fechaFin: this.obtenerFinSemana(fecha),
          numeroSemana: numeroSemana,
          year: year,
          fechaCreacion: new Date(),
          fechaActualizacion: new Date(),
        });
      }
      await this.actualizarVentasMensuales(venta);

      console.log('Ventas actualizadas exitosamente');
    } catch (error) {
      console.error('Error al actualizar ventas:', error);
      throw error;
    }
  }

  // Obtener el total general
  getTotalVentas(usuarioId: string): Observable<Venta> {
    return this.firestore
      .doc<Venta>(`users/${usuarioId}/Ventas/total`)
      .valueChanges();
  }

  // Obtener las ventas semanales
  getVentasSemanales(usuarioId: string): Observable<VentaSemanal[]> {
    return this.firestore
      .collection<VentaSemanal>(`users/${usuarioId}/VentasSemanales`, (ref) =>
        ref.orderBy('fechaCreacion', 'desc')
      )
      .valueChanges();
  }

  // Métodos auxiliares
  private obtenerNumeroSemana(fecha: Date): number {
    const inicioAno = new Date(fecha.getFullYear(), 0, 1);
    const dias = Math.floor((fecha.getTime() - inicioAno.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((dias + inicioAno.getDay() + 1) / 7);
  }

  private obtenerInicioSemana(fecha: Date): Date {
    const inicio = new Date(fecha);
    inicio.setDate(fecha.getDate() - fecha.getDay());
    inicio.setHours(0, 0, 0, 0);
    return inicio;
  }

  private obtenerFinSemana(fecha: Date): Date {
    const fin = new Date(fecha);
    fin.setDate(fecha.getDate() - fecha.getDay() + 6);
    fin.setHours(23, 59, 59, 999);
    return fin;
  }


  getVendedoresConVentas(): Observable<VendedorVentas[]> {
    return this.firestore
      .collection<User>('users', (ref) => ref.where('role', '==', 'Vendedor'))
      .valueChanges()
      .pipe(
        switchMap((vendedores) => {
          // Creamos un observable que combina las ventas diarias y semanales para cada vendedor
          const vendedoresConVentas$ = vendedores.map((vendedor) => {
            return combineLatest([
              this.getVentasDiarias(vendedor.uid),
              this.getVentasSemanales(vendedor.uid),
            ]).pipe(
              map(([ventasDiarias, ventasSemanales]) => ({
                ...vendedor, // Incluimos la información del vendedor
                ventasDiarias: ventasDiarias?.Monto || 0, // Calculamos ventas diarias
                ventasSemanales: ventasSemanales[0]?.Monto || 0, // Calculamos ventas semanales
              }))
            );
          });

          // Usamos combineLatest para combinar todos los observables de los vendedores
          return combineLatest(vendedoresConVentas$);
        })
      );
  }

  getVentasDiarias(userId: string): Observable<Venta | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.firestore
      .collection<Venta>(`users/${userId}/Ventas`, (ref) =>
        ref.where('fecha', '>=', today)
      )
      .valueChanges()
      .pipe(
        map((ventas) => {
          if (ventas.length === 0) return null;
          const totalDiario = ventas.reduce((sum, venta) => sum + venta.Monto, 0);
          return {
            Monto: totalDiario,
            fecha: today,
          };
        })
      );
  }
}