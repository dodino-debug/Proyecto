// DOVI S.A.S. - Controllers: ContractController
// Coordinates creation of project requests (contracts) between view forms and SolicitudModel.

(function() {
  "use strict";

  class ContractController {
    static init() {
      const currentUser = window.UserModel.getCurrentUser();
      const loginWarning = document.getElementById('login-warning');
      const contractForm = document.getElementById('contract-form');

      if (!currentUser) {
        if (loginWarning) loginWarning.classList.remove('d-none');
        if (contractForm) contractForm.classList.add('d-none');
        return;
      }

      if (loginWarning) loginWarning.classList.add('d-none');
      if (contractForm) contractForm.classList.remove('d-none');

      // Fetch dynamic active lists from Models
      const servicesList = window.ServicioModel.getAll()
        .filter(s => s.estado === "Activo")
        .map(s => ({ id: s.slug, nombre: s.nombre }));

      const machinesList = window.MaquinariaModel.getAll()
        .filter(m => m.estado === "Disponible")
        .map(m => ({ id: m.slug, nombre: m.nombre }));

      // Initialize dropdown options
      window.ContractView.initForm(servicesList, machinesList);
      
      // Bind changes and submissions
      this.bindEvents(contractForm);
    }

    static bindEvents(form) {
      const selectServicio = document.getElementById('id_servicio');
      const selectMaquina = document.getElementById('id_maquina');
      const tipoSolicitud = document.getElementById('tipo_solicitud');

      if (tipoSolicitud) {
        tipoSolicitud.addEventListener('change', function() {
          window.ContractView.toggleFields();
        });
        window.ContractView.toggleFields();
      }

      form.addEventListener('submit', function(e) {
        e.preventDefault();

        const selectedServiceOpt = selectServicio && selectServicio.selectedIndex !== -1 ? selectServicio.options[selectServicio.selectedIndex] : null;
        const selectedMachineOpt = selectMaquina && selectMaquina.selectedIndex !== -1 ? selectMaquina.options[selectMaquina.selectedIndex] : null;

        const solData = {
          tipo_solicitud: tipoSolicitud.value,
          id_servicio: selectServicio ? selectServicio.value || null : null,
          nombre_servicio: selectServicio && selectServicio.value ? selectedServiceOpt.textContent : null,
          id_maquina: selectMaquina ? selectMaquina.value || null : null,
          nombre_maquina: selectMaquina && selectMaquina.value ? selectedMachineOpt.textContent : null,
          direccion_servicio: document.getElementById('direccion_servicio').value,
          fecha_inicio: document.getElementById('fecha_inicio').value,
          fecha_fin: document.getElementById('fecha_fin').value,
          descripcion_detallada: document.getElementById('descripcion_detallada').value
        };

        const result = window.SolicitudModel.add(solData);
        if (result.success) {
          window.ContractView.showStatus('success', '¡Su solicitud ha sido enviada con éxito!');
          form.reset();
          window.ContractView.toggleFields();
        } else {
          window.ContractView.showStatus('error', result.error);
        }
      });
    }
  }

  // Expose to global window scope
  window.ContractController = ContractController;

})();
