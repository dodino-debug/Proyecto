// DOVI S.A.S. - Models: ContratoModel
// Encapsulates contract query and creation logic.

(function() {
  "use strict";

  class ContratoModel {
    static getAll() {
      return window.Database.read("dovi_contratos");
    }

    static saveAll(contratos) {
      window.Database.write("dovi_contratos", contratos);
    }

    static generateForApprovedRequest(solicitud) {
      const contratos = this.getAll();
      const contractExists = contratos.some(c => c.cliente_nombre === solicitud.cliente_nombre && c.estado === "Activo");
      
      if (!contractExists) {
        const randomCode = "CON-2026-" + Math.floor(100 + Math.random() * 900);
        const maxId = contratos.reduce((max, c) => c.id > max ? c.id : max, 0);
        const newId = maxId > 0 ? maxId + 1 : 502;
        contratos.unshift({
          id: newId,
          cliente_nombre: solicitud.cliente_nombre,
          codigo_contrato: randomCode,
          estado: "Activo",
          created_at: new Date().toISOString()
        });
        this.saveAll(contratos);
        return true;
      }
      return false;
    }
  }

  // Expose to global window scope
  window.ContratoModel = ContratoModel;

})();
