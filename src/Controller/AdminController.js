// DOVI S.A.S. - Controllers: AdminController
// Coordinates Admin panel actions, data fetching, views population, and event binding.

(function() {
  "use strict";

  class AdminController {
    static init() {
      // 1. Force Admin access check
      window.AuthController.checkAdminAccess();

      // 2. Initial dashboard render
      this.refreshDashboard();

      // 3. Bind global CRUD events once
      this.bindGlobalCrud();
    }

    static refreshDashboard() {
      const stats = window.PagoModel.getStats();
      const pagos = window.PagoModel.getAll();
      const solicitudes = window.SolicitudModel.getAll();
      const contratos = window.ContratoModel.getAll();
      const servicios = window.ServicioModel.getAll();
      const maquinarias = window.MaquinariaModel.getAll();

      // Update View
      window.AdminView.renderDashboard(stats, pagos, solicitudes, contratos, servicios, maquinarias);

      // Re-bind action button events and row clicks
      this.bindActions();
    }

    static bindActions() {
      const self = this;

      // Verify payment click events
      document.querySelectorAll(".btn-action-verify").forEach(btn => {
        btn.addEventListener("click", function(e) {
          e.stopPropagation(); // Prevent row click details modal trigger
          const id = this.getAttribute("data-id");
          window.PagoModel.updateEstado(id, "Verificado");
          window.AdminView.showNotification("El pago #" + id + " ha sido verificado con éxito.");
          self.refreshDashboard();
        });
      });

      // Reject payment click events
      document.querySelectorAll(".btn-action-reject").forEach(btn => {
        btn.addEventListener("click", function(e) {
          e.stopPropagation(); // Prevent row click details modal trigger
          const id = this.getAttribute("data-id");
          window.PagoModel.updateEstado(id, "Rechazado");
          window.AdminView.showNotification("El pago #" + id + " ha sido rechazado.");
          self.refreshDashboard();
        });
      });

      // Approve request click events
      document.querySelectorAll(".btn-sol-approve").forEach(btn => {
        btn.addEventListener("click", function(e) {
          e.stopPropagation(); // Prevent row click details modal trigger
          const id = this.getAttribute("data-id");
          window.SolicitudModel.updateEstado(id, "Aprobada");
          window.AdminView.showNotification("La solicitud #" + id + " ha sido aprobada y se ha generado su contrato de servicio.");
          self.refreshDashboard();
        });
      });

      // Reject request click events
      document.querySelectorAll(".btn-sol-reject").forEach(btn => {
        btn.addEventListener("click", function(e) {
          e.stopPropagation(); // Prevent row click details modal trigger
          const id = this.getAttribute("data-id");
          window.SolicitudModel.updateEstado(id, "Rechazada");
          window.AdminView.showNotification("La solicitud #" + id + " ha sido rechazada.");
          self.refreshDashboard();
        });
      });

      // Edit buttons for services/machinery
      document.querySelectorAll(".btn-crud-edit").forEach(btn => {
        btn.addEventListener("click", function(e) {
          e.stopPropagation();
          const id = this.getAttribute("data-id");
          const type = this.getAttribute("data-type");
          self.openCrudModal("edit", type, id);
        });
      });

      // Delete buttons for services/machinery
      document.querySelectorAll(".btn-crud-delete").forEach(btn => {
        btn.addEventListener("click", function(e) {
          e.stopPropagation();
          const id = this.getAttribute("data-id");
          const type = this.getAttribute("data-type");
          if (confirm(`¿Está seguro de que desea eliminar este ${type}?`)) {
            if (type === "servicio") {
              window.ServicioModel.delete(id);
            } else {
              window.MaquinariaModel.delete(id);
            }
            window.AdminView.showNotification(`El ${type} ha sido eliminado.`);
            self.refreshDashboard();
          }
        });
      });

      // Bind Row Click Events for Detailed Modal View
      document.querySelectorAll("#table-pagos-body tr, #table-solicitudes-body tr, #table-contratos-body tr").forEach(row => {
        row.addEventListener("click", function(e) {
          // If the click is on an interactive element inside the row (like buttons), do nothing
          if (e.target.closest("button") || e.target.closest("a") || e.target.closest(".btn-group")) {
            return;
          }
          const id = this.getAttribute("data-id");
          const type = this.getAttribute("data-type");
          if (id && type) {
            self.showDetails(type, id);
          }
        });
      });
    }

    static showDetails(type, id) {
      let title = "";
      let htmlContent = "";

      if (type === 'pago') {
        const pagos = window.PagoModel.getAll();
        const item = pagos.find(p => p.id === parseInt(id));
        if (item) {
          title = `<i class="bi bi-cash-coin text-warning"></i> Detalle de Pago #${item.id}`;
          const formattedDate = new Date(item.created_at).toLocaleString('es-CO') + " " + new Date(item.created_at).toLocaleTimeString('es-CO', {hour: '2-digit', minute:'2-digit'});
          htmlContent = `
            <div class="row g-3">
              <div class="col-md-6"><strong>Código de Contrato:</strong> <span class="badge bg-secondary font-monospace admin-detail-badge-code">${item.codigo_contrato}</span></div>
              <div class="col-md-6"><strong>Monto:</strong> <span class="text-success fw-bold admin-detail-amount">$${item.monto.toLocaleString('es-CO')}</span></div>
              <div class="col-md-6"><strong>Cliente Contratante:</strong> ${item.cliente_nombre}</div>
              <div class="col-md-6"><strong>Email del Cliente:</strong> ${item.cliente_email}</div>
              <div class="col-md-6"><strong>Fecha de Registro:</strong> ${formattedDate}</div>
              <div class="col-md-6">
                <strong>Estado actual:</strong> 
                <span class="badge ${item.estado === 'Verificado' ? 'bg-success' : (item.estado === 'Rechazado' ? 'bg-danger' : 'bg-warning text-dark')}">${item.estado}</span>
              </div>
            </div>
          `;
        }
      } else if (type === 'solicitud') {
        const solicitudes = window.SolicitudModel.getAll();
        const item = solicitudes.find(s => s.id === parseInt(id));
        if (item) {
          title = `<i class="bi bi-file-earmark-medical text-info"></i> Detalle de Solicitud #${item.id}`;
          let detail = "";
          if (item.tipo_solicitud === "Servicio") {
            detail = `<div class="col-12"><strong>Servicio Agrícola Requerido:</strong> ${item.nombre_servicio}</div>`;
          } else if (item.tipo_solicitud === "Maquinaria") {
            detail = `<div class="col-12"><strong>Maquinaria Requerida:</strong> ${item.nombre_maquina}</div>`;
          } else {
            detail = `
              <div class="col-md-6"><strong>Servicio Agrícola Requerido:</strong> ${item.nombre_servicio}</div>
              <div class="col-md-6"><strong>Maquinaria Requerida:</strong> ${item.nombre_maquina}</div>
            `;
          }

          htmlContent = `
            <div class="row g-3">
              <div class="col-md-6"><strong>Nombre del Cliente:</strong> ${item.cliente_nombre}</div>
              <div class="col-md-6"><strong>Email del Cliente:</strong> ${item.cliente_email}</div>
              <div class="col-md-6"><strong>Tipo de Solicitud:</strong> <span class="badge bg-secondary">${item.tipo_solicitud}</span></div>
              <div class="col-md-6"><strong>Ubicación del Proyecto:</strong> ${item.direccion_servicio}</div>
              <div class="col-md-6"><strong>Fecha de Inicio:</strong> ${item.fecha_inicio}</div>
              <div class="col-md-6"><strong>Fecha de Fin:</strong> ${item.fecha_fin}</div>
              ${detail}
              <div class="col-12">
                <strong>Descripción del Proyecto:</strong>
                <p class="bg-dark p-3 rounded text-white-50 mt-2 admin-detail-description">${item.descripcion_detallada}</p>
              </div>
              <div class="col-md-6">
                <strong>Estado:</strong> 
                <span class="badge ${item.estado === 'Aprobada' ? 'bg-success' : (item.estado === 'Rechazada' ? 'bg-danger' : 'bg-warning text-dark')}">${item.estado}</span>
              </div>
              <div class="col-md-6"><strong>Fecha de Envío:</strong> ${new Date(item.created_at).toLocaleString('es-CO')}</div>
            </div>
          `;
        }
      } else if (type === 'contrato') {
        const contratos = window.ContratoModel.getAll();
        const item = contratos.find(c => c.id === parseInt(id));
        if (item) {
          title = `<i class="bi bi-journal-check text-success"></i> Detalle de Contrato #${item.id}`;
          htmlContent = `
            <div class="row g-3">
              <div class="col-md-6"><strong>Código de Contrato:</strong> <span class="badge bg-success font-monospace admin-detail-badge-success">${item.codigo_contrato}</span></div>
              <div class="col-md-6"><strong>Cliente Contratante:</strong> ${item.cliente_nombre}</div>
              <div class="col-md-6"><strong>Fecha de Firma/Emisión:</strong> ${new Date(item.created_at).toLocaleString('es-CO')}</div>
              <div class="col-md-6">
                <strong>Estado:</strong> 
                <span class="badge bg-success">${item.estado}</span>
              </div>
            </div>
          `;
        }
      }

      if (htmlContent) {
        document.getElementById("adminDetailModalLabel").innerHTML = title;
        document.getElementById("adminDetailModalBody").innerHTML = htmlContent;

        // Show Bootstrap Modal using getOrCreateInstance
        const modalEl = document.getElementById("adminDetailModal");
        if (modalEl && window.bootstrap) {
          const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalEl);
          modalInstance.show();
        }
      }
    }

    static bindGlobalCrud() {
      const self = this;
      
      const btnAddServicio = document.getElementById("btn-add-servicio");
      if (btnAddServicio) {
        btnAddServicio.addEventListener("click", () => {
          self.openCrudModal("add", "servicio");
        });
      }

      const btnAddMaquina = document.getElementById("btn-add-maquina");
      if (btnAddMaquina) {
        btnAddMaquina.addEventListener("click", () => {
          self.openCrudModal("add", "maquinaria");
        });
      }

      const form = document.getElementById("admin-crud-form");
      if (form) {
        form.addEventListener("submit", function(e) {
          e.preventDefault();
          const id = document.getElementById("crud-id").value;
          const type = document.getElementById("crud-type").value;
          const nombre = document.getElementById("crud-nombre").value.trim();
          let slug = document.getElementById("crud-slug").value.trim();
          const estado = document.getElementById("crud-estado").value;

          if (!slug) {
            slug = nombre.toLowerCase().replace(/[^a-z0-9_]+/g, "-");
          }

          const data = { nombre, slug, estado };

          if (id) {
            if (type === "servicio") {
              window.ServicioModel.update(id, data);
            } else {
              window.MaquinariaModel.update(id, data);
            }
            window.AdminView.showNotification("Elemento actualizado con éxito.");
          } else {
            if (type === "servicio") {
              window.ServicioModel.add(data);
            } else {
              window.MaquinariaModel.add(data);
            }
            window.AdminView.showNotification("Elemento creado con éxito.");
          }

          // Close modal
          const modalEl = document.getElementById("adminCrudModal");
          if (modalEl && window.bootstrap) {
            const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalEl);
            modalInstance.hide();
          }

          self.refreshDashboard();
        });
      }
    }

    static openCrudModal(mode, type, id) {
      document.getElementById("admin-crud-form").reset();
      document.getElementById("crud-id").value = id || "";
      document.getElementById("crud-type").value = type;

      const titleEl = document.getElementById("adminCrudModalLabel");
      const estadoSelect = document.getElementById("crud-estado");

      if (type === "servicio") {
        titleEl.textContent = mode === "add" ? "Agregar Servicio Agrícola" : "Editar Servicio Agrícola";
        estadoSelect.innerHTML = `
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        `;
      } else {
        titleEl.textContent = mode === "add" ? "Agregar Maquinaria Pesada" : "Editar Maquinaria Pesada";
        estadoSelect.innerHTML = `
          <option value="Disponible">Disponible</option>
          <option value="Mantenimiento">Mantenimiento</option>
          <option value="No Disponible">No Disponible</option>
        `;
      }

      if (mode === "edit" && id) {
        const item = type === "servicio" 
          ? window.ServicioModel.getById(id)
          : window.MaquinariaModel.getById(id);
        
        if (item) {
          document.getElementById("crud-nombre").value = item.nombre;
          document.getElementById("crud-slug").value = item.slug;
          estadoSelect.value = item.estado;
        }
      }

      // Show modal
      const modalEl = document.getElementById("adminCrudModal");
      if (modalEl && window.bootstrap) {
        const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.show();
      }
    }
  }

  // Expose to global window scope
  window.AdminController = AdminController;

})();
