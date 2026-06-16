// DOVI S.A.S. - Models: ServicioModel
// Handles CRUD operations on agricultural services data stored in Database (localStorage).

(function() {
  "use strict";

  class ServicioModel {
    static getAll() {
      return window.Database.read("dovi_servicios");
    }

    static saveAll(services) {
      window.Database.write("dovi_servicios", services);
    }

    static getById(id) {
      const services = this.getAll();
      return services.find(s => s.id === parseInt(id)) || null;
    }

    static add(serviceData) {
      const services = this.getAll();
      const maxId = services.reduce((max, s) => s.id > max ? s.id : max, 0);
      const newId = maxId > 0 ? maxId + 1 : 1;

      const newService = {
        id: newId,
        nombre: serviceData.nombre,
        slug: serviceData.slug || serviceData.nombre.toLowerCase().replace(/[^a-z0-9_]+/g, "-"),
        estado: serviceData.estado || "Activo"
      };

      services.push(newService);
      this.saveAll(services);
      return { success: true, service: newService };
    }

    static update(id, serviceData) {
      const services = this.getAll();
      const index = services.findIndex(s => s.id === parseInt(id));
      if (index === -1) {
        return { success: false, error: "Servicio no encontrado" };
      }

      services[index] = {
        ...services[index],
        nombre: serviceData.nombre,
        slug: serviceData.slug || services[index].slug,
        estado: serviceData.estado || services[index].estado
      };

      this.saveAll(services);
      return { success: true, service: services[index] };
    }

    static delete(id) {
      const services = this.getAll();
      const filtered = services.filter(s => s.id !== parseInt(id));
      if (services.length === filtered.length) {
        return { success: false, error: "Servicio no encontrado" };
      }
      this.saveAll(filtered);
      return { success: true };
    }
  }

  // Expose to window
  window.ServicioModel = ServicioModel;
})();
