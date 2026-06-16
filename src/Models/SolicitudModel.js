// DOVI S.A.S. - Models: SolicitudModel
// Encapsulates project requests (solicitudes) query and update operations.

(function() {
  "use strict";

  class SolicitudModel {
    static getAll() {
      return window.Database.read("dovi_solicitudes");
    }

    static saveAll(solicitudes) {
      window.Database.write("dovi_solicitudes", solicitudes);
    }

    static add(solData) {
      const currentUser = window.UserModel.getCurrentUser();
      if (!currentUser) {
        return { success: false, error: "Debe iniciar sesión para enviar una solicitud." };
      }

      const solicitudes = this.getAll();
      const maxId = solicitudes.reduce((max, s) => s.id > max ? s.id : max, 0);
      const newId = maxId > 0 ? maxId + 1 : 104;

      const newSol = {
        id: newId,
        cliente_nombre: currentUser.nombre + " " + currentUser.apellido,
        cliente_email: currentUser.email,
        tipo_solicitud: solData.tipo_solicitud,
        id_maquina: solData.id_maquina || null,
        nombre_maquina: solData.nombre_maquina || null,
        id_servicio: solData.id_servicio || null,
        nombre_servicio: solData.nombre_servicio || null,
        fecha_inicio: solData.fecha_inicio,
        fecha_fin: solData.fecha_fin,
        direccion_servicio: solData.direccion_servicio,
        descripcion_detallada: solData.descripcion_detallada,
        estado: "Pendiente",
        created_at: new Date().toISOString()
      };

      solicitudes.unshift(newSol);
      this.saveAll(solicitudes);
      return { success: true, solicitud: newSol };
    }

    static updateEstado(id, nuevoEstado) {
      const solicitudes = this.getAll();
      const solIndex = solicitudes.findIndex(s => s.id === parseInt(id));
      
      if (solIndex !== -1) {
        solicitudes[solIndex].estado = nuevoEstado;
        this.saveAll(solicitudes);

        // If approved, automatically trigger contract creation
        if (nuevoEstado === "Aprobada") {
          window.ContratoModel.generateForApprovedRequest(solicitudes[solIndex]);
        }
        return true;
      }
      return false;
    }
  }

  // Expose to global window scope
  window.SolicitudModel = SolicitudModel;

})();
