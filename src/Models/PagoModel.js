// DOVI S.A.S. - Models: PagoModel
// Encapsulates client payment data management and aggregates system-wide metrics/statistics.

(function() {
  "use strict";

  class PagoModel {
    static getAll() {
      return window.Database.read("dovi_pagos");
    }

    static saveAll(pagos) {
      window.Database.write("dovi_pagos", pagos);
    }

    static updateEstado(id, nuevoEstado) {
      const pagos = this.getAll();
      const pagoIndex = pagos.findIndex(p => p.id === parseInt(id));
      
      if (pagoIndex !== -1) {
        pagos[pagoIndex].estado = nuevoEstado;
        this.saveAll(pagos);
        return true;
      }
      return false;
    }

    static getStats() {
      const solicitudes = window.SolicitudModel.getAll();
      const pagos = this.getAll();
      const contratos = window.ContratoModel.getAll();

      const stats = {
        pagos_pendientes: pagos.filter(p => p.estado === "Pendiente").length,
        pagos_verificados: pagos.filter(p => p.estado === "Verificado").length,
        monto_total_verificado: pagos.filter(p => p.estado === "Verificado").reduce((acc, p) => acc + p.monto, 0),
        solicitudes_pendientes: solicitudes.filter(s => s.estado === "Pendiente").length,
        solicitudes_totales: solicitudes.length,
        contratos_activos: contratos.filter(c => c.estado === "Activo").length,
        maquinas_mantenimiento: 1 // mock
      };

      return stats;
    }
  }

  // Expose to global window scope
  window.PagoModel = PagoModel;

})();
