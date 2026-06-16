// DOVI S.A.S. - Models: MaquinariaModel
// Handles CRUD operations on heavy machinery data stored in Database (localStorage).

(function() {
  "use strict";

  class MaquinariaModel {
    static getAll() {
      return window.Database.read("dovi_maquinaria");
    }

    static saveAll(machines) {
      window.Database.write("dovi_maquinaria", machines);
    }

    static getById(id) {
      const machines = this.getAll();
      return machines.find(m => m.id === parseInt(id)) || null;
    }

    static add(machineData) {
      const machines = this.getAll();
      const maxId = machines.reduce((max, m) => m.id > max ? m.id : max, 0);
      const newId = maxId > 0 ? maxId + 1 : 1;

      const newMachine = {
        id: newId,
        nombre: machineData.nombre,
        slug: machineData.slug || machineData.nombre.toLowerCase().replace(/[^a-z0-9_]+/g, "-"),
        estado: machineData.estado || "Disponible"
      };

      machines.push(newMachine);
      this.saveAll(machines);
      return { success: true, machine: newMachine };
    }

    static update(id, machineData) {
      const machines = this.getAll();
      const index = machines.findIndex(m => m.id === parseInt(id));
      if (index === -1) {
        return { success: false, error: "Maquinaria no encontrada" };
      }

      machines[index] = {
        ...machines[index],
        nombre: machineData.nombre,
        slug: machineData.slug || machines[index].slug,
        estado: machineData.estado || machines[index].estado
      };

      this.saveAll(machines);
      return { success: true, machine: machines[index] };
    }

    static delete(id) {
      const machines = this.getAll();
      const filtered = machines.filter(m => m.id !== parseInt(id));
      if (machines.length === filtered.length) {
        return { success: false, error: "Maquinaria no encontrada" };
      }
      this.saveAll(filtered);
      return { success: true };
    }
  }

  // Expose to window
  window.MaquinariaModel = MaquinariaModel;
})();
