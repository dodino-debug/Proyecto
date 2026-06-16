// DOVI S.A.S. - Views: ContractView
// Manages contract request forms visibility toggle and selector population.

(function() {
  "use strict";

  class ContractView {
    static initForm(services, machines) {
      const selectServicio = document.getElementById('id_servicio');
      const selectMaquina = document.getElementById('id_maquina');

      if (selectServicio && selectServicio.children.length <= 1) {
        services.forEach(ser => {
          const opt = document.createElement('option');
          opt.value = ser.id;
          opt.textContent = ser.nombre;
          selectServicio.appendChild(opt);
        });
      }

      if (selectMaquina && selectMaquina.children.length <= 1) {
        machines.forEach(maq => {
          const opt = document.createElement('option');
          opt.value = maq.id;
          opt.textContent = maq.nombre;
          selectMaquina.appendChild(opt);
        });
      }
    }

    static toggleFields() {
      const tipoSolicitud = document.getElementById('tipo_solicitud');
      const containerServicio = document.getElementById('container_servicio');
      const containerMaquina = document.getElementById('container_maquina');
      const selectServicio = document.getElementById('id_servicio');
      const selectMaquina = document.getElementById('id_maquina');

      if (!tipoSolicitud || !containerServicio || !containerMaquina) return;

      const val = tipoSolicitud.value;

      if (val === 'Servicio') {
        containerServicio.classList.remove('d-none');
        if (selectServicio) selectServicio.required = true;
        containerMaquina.classList.add('d-none');
        if (selectMaquina) {
          selectMaquina.required = false;
          selectMaquina.value = '';
        }
      } else if (val === 'Maquinaria') {
        containerServicio.classList.add('d-none');
        if (selectServicio) {
          selectServicio.required = false;
          selectServicio.value = '';
        }
        containerMaquina.classList.remove('d-none');
        if (selectMaquina) selectMaquina.required = true;
      } else if (val === 'Ambos') {
        containerServicio.classList.remove('d-none');
        if (selectServicio) selectServicio.required = true;
        containerMaquina.classList.remove('d-none');
        if (selectMaquina) selectMaquina.required = true;
      } else {
        containerServicio.classList.add('d-none');
        if (selectServicio) {
          selectServicio.required = false;
          selectServicio.value = '';
        }
        containerMaquina.classList.add('d-none');
        if (selectMaquina) {
          selectMaquina.required = false;
          selectMaquina.value = '';
        }
      }
    }

    static showStatus(type, message) {
      const successAlert = document.getElementById('submit-success');
      const errorAlert = document.getElementById('submit-error');
      
      if (successAlert) successAlert.classList.add('d-none');
      if (errorAlert) errorAlert.classList.add('d-none');

      if (type === 'success' && successAlert) {
        const text = document.getElementById('success-text');
        if (text) text.textContent = message;
        successAlert.classList.remove('d-none');
      } else if (type === 'error' && errorAlert) {
        const text = document.getElementById('error-text');
        if (text) text.textContent = message;
        errorAlert.classList.remove('d-none');
      }
    }
  }

  // Expose to global window scope
  window.ContractView = ContractView;

})();
