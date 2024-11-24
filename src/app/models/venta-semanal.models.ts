

export interface VentaSemanal {
  Monto: number; // Total de ventas en la semana
  fechaInicio: Date; // Fecha de inicio de la semana
  fechaFin: Date; // Fecha de fin de la semana
  numeroSemana: number; // Número de la semana
  year: number; // Año de la semana
  fechaCreacion: Date; // Fecha de creación del registro semanal
  fechaActualizacion: Date; // Última actualización del registro
}
