import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../firebase/firestore.service';
import { User } from '../../models/user.models';
import { VentasMensuales } from './../../models/ventas-mensuales.models';


interface VendedorVentas extends User {
  ventasDiarias?: number;
  ventasSemanales?: number;
  expanded?: boolean;
}

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  vendedores: VendedorVentas[] = [];
  ventasMensuales: VentasMensuales[] = [];  // Todos los datos de ventas mensuales
  ventasMensualesDetalles: VentasMensuales | null = null;  // Detalle del mes seleccionado
  meses: string[] = [];  // Lista de meses con año
  mesSeleccionado: string = '';  // Mes seleccionado para mostrar detalles
  loading = true;

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit() {
this.firestoreService.getVentasMensuales().subscribe({
      next: (ventas) => {
        this.ventasMensuales = ventas;
        // Generamos una lista de meses (mes-año)
        this.meses = this.ventasMensuales.map((venta) =>
          `${new Date(venta.fechaInicio).toLocaleString('default', { month: 'long', year: 'numeric' })}`
        );
      },
      error: (err) => {
        console.error('Error al obtener ventas mensuales:', err);
      },
    });
   this.cargarVendedores();
  }

  cargarVendedores() {
    this.firestoreService.getVendedoresConVentas().subscribe(
      (vendedores) => {
        this.vendedores = vendedores.map(v => ({...v, expanded: false}));
        this.loading = false;
      },
      (error) => {
        console.error('Error al cargar vendedores:', error);
        this.loading = false;
      }
    );
  }


  eliminarUsuario(vendedor: VendedorVentas) {
    if (confirm(`¿Estás seguro de que deseas eliminar al usuario ${vendedor.nombre}?`)) {
      this.firestoreService.deleteUser(vendedor.uid)
        .then(() => {
          // Filtra el usuario eliminado de la lista local
          this.vendedores = this.vendedores.filter(v => v.uid !== vendedor.uid);
          console.log(`Usuario ${vendedor.nombre} eliminado con éxito.`);
        })
        .catch(error => {
          console.error('Error al eliminar usuario:', error);
        });
      }}

  toggleVendedor(vendedor: VendedorVentas) {
    vendedor.expanded = !vendedor.expanded;
  }

  mostrarDetallesMes(mes: string) {
    const venta = this.ventasMensuales.find((v) =>
      new Date(v.fechaInicio).toLocaleString('default', { month: 'long', year: 'numeric' }) === mes
    );
    this.mesSeleccionado = mes;
    this.ventasMensualesDetalles = venta || null;
  }






}
