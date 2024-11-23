

export interface VentasMensuales{
  Monto: number;          // Total acumulado de ventas para el mes
  fechaInicio: Date;      // Fecha de inicio del mes
  fechaFin: Date;         // Fecha de fin del mes
  fechaActualizacion: Date; // Última fecha en la que se actualizó el total
}
