// DOVI S.A.S. - Views: AdminView
// Manages rendering statistics dashboard, payments, contracts, and request tables.

(function() {
  "use strict";

  class AdminView {
    static renderDashboard(stats, pagos, solicitudes, contratos) {
      // 1. Populate stats cards
      const statPagos = document.getElementById("stat-pagos-pendientes");
      if (statPagos) statPagos.textContent = stats.pagos_pendientes;
      
      const statTotal = document.getElementById("stat-total-verificado");
      if (statTotal) statTotal.textContent = "$" + stats.monto_total_verificado.toLocaleString('es-CO');
      
      const statSol = document.getElementById("stat-solicitudes-pendientes");
      if (statSol) statSol.textContent = stats.solicitudes_pendientes;
      
      const statCon = document.getElementById("stat-contratos-activos");
      if (statCon) statCon.textContent = stats.contratos_activos;

      // 2. Tab indicators count
      const countPagos = document.getElementById("count-pagos");
      if (countPagos) countPagos.textContent = pagos.length;

      const countSol = document.getElementById("count-solicitudes");
      if (countSol) countSol.textContent = solicitudes.length;

      const countCon = document.getElementById("count-contratos");
      if (countCon) countCon.textContent = contratos.length;

      // Badges
      const badgePagos = document.getElementById("badge-pagos-pendientes");
      if (badgePagos) badgePagos.textContent = stats.pagos_pendientes + " Pendientes";

      const badgeSol = document.getElementById("badge-solicitudes-pendientes");
      if (badgeSol) badgeSol.textContent = stats.solicitudes_pendientes + " Pendientes";

      // 3. Render Pagos Table
      this.renderPagos(pagos);

      // 4. Render Solicitudes Table
      this.renderSolicitudes(solicitudes);

      // 5. Render Contratos Table
      this.renderContratos(contratos);
    }

    static renderPagos(pagos) {
      const pagosBody = document.getElementById("table-pagos-body");
      if (!pagosBody) return;

      pagosBody.innerHTML = "";
      if (pagos.length === 0) {
        pagosBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-white-50">No hay pagos registrados</td></tr>`;
        return;
      }

      pagos.forEach(p => {
        let badgeClass = "bg-warning text-dark";
        if (p.estado === "Verificado") badgeClass = "bg-success text-white";
        if (p.estado === "Rechazado") badgeClass = "bg-danger text-white";

        let actionHtml = "";
        if (p.estado === "Pendiente") {
          actionHtml = `
            <div class="btn-group gap-1">
              <button class="btn btn-sm btn-success rounded btn-action-verify" data-id="${p.id}"><i class="bi bi-check-lg"></i></button>
              <button class="btn btn-sm btn-danger rounded btn-action-reject" data-id="${p.id}"><i class="bi bi-x-lg"></i></button>
            </div>
          `;
        } else {
          actionHtml = `<span class="text-white-50 small">-</span>`;
        }

        const formattedDate = new Date(p.created_at).toLocaleDateString('es-CO') + " " + new Date(p.created_at).toLocaleTimeString('es-CO', {hour: '2-digit', minute:'2-digit'});

        pagosBody.innerHTML += `
          <tr data-id="${p.id}" data-type="pago" class="admin-table-row" title="Haga clic para ver los detalles de este pago">
            <td class="text-center fw-bold text-white-50">#${p.id}</td>
            <td><span class="badge bg-secondary font-monospace">${p.codigo_contrato}</span></td>
            <td>
              <div class="fw-bold text-white">${p.cliente_nombre}</div>
              <div class="text-white-50 admin-small-email">${p.cliente_email}</div>
            </td>
            <td class="text-end fw-bold text-success">$${p.monto.toLocaleString('es-CO')}</td>
            <td class="small text-center">${formattedDate}</td>
            <td class="text-center"><span class="badge ${badgeClass}">${p.estado}</span></td>
            <td class="text-center">${actionHtml}</td>
          </tr>
        `;
      });
    }

    static renderSolicitudes(solicitudes) {
      const solicitudesBody = document.getElementById("table-solicitudes-body");
      if (!solicitudesBody) return;

      solicitudesBody.innerHTML = "";
      if (solicitudes.length === 0) {
        solicitudesBody.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-white-50">No hay solicitudes registradas</td></tr>`;
        return;
      }

      solicitudes.forEach(s => {
        let badgeClass = "bg-warning text-dark";
        if (s.estado === "Aprobada") badgeClass = "bg-success text-white";
        if (s.estado === "Rechazada") badgeClass = "bg-danger text-white";

        let detailText = "";
        if (s.tipo_solicitud === "Servicio") detailText = `Servicio: <strong>${s.nombre_servicio}</strong>`;
        else if (s.tipo_solicitud === "Maquinaria") detailText = `Máquina: <strong>${s.nombre_maquina}</strong>`;
        else detailText = `Svc: <strong>${s.nombre_servicio}</strong> + Máq: <strong>${s.nombre_maquina}</strong>`;

        let actionHtml = "";
        if (s.estado === "Pendiente") {
          actionHtml = `
            <div class="btn-group gap-1">
              <button class="btn btn-sm btn-success rounded btn-sol-approve" data-id="${s.id}">Aprobar</button>
              <button class="btn btn-sm btn-danger rounded btn-sol-reject" data-id="${s.id}">Rechazar</button>
            </div>
          `;
        } else {
          actionHtml = `<span class="text-white-50 small">-</span>`;
        }

        solicitudesBody.innerHTML += `
          <tr data-id="${s.id}" data-type="solicitud" class="admin-table-row font-size-09" title="Haga clic para ver los detalles de esta solicitud">
            <td class="text-center fw-bold text-white-50">#${s.id}</td>
            <td>
              <div class="fw-bold text-white">${s.cliente_nombre}</div>
              <div class="text-white-50 admin-tiny-text">${s.cliente_email}</div>
            </td>
            <td><span class="badge bg-secondary">${s.tipo_solicitud}</span></td>
            <td>
              <div class="small">${detailText}</div>
              <div class="small text-white-50 admin-table-desc-text" title="${s.descripcion_detallada}">${s.descripcion_detallada}</div>
            </td>
            <td class="text-center small">${s.fecha_inicio}</td>
            <td class="text-center small">${s.fecha_fin}</td>
            <td class="small">${s.direccion_servicio}</td>
            <td class="text-center"><span class="badge ${badgeClass}">${s.estado}</span></td>
            <td class="text-center">${actionHtml}</td>
          </tr>
        `;
      });
    }

    static renderContratos(contratos) {
      const contratosBody = document.getElementById("table-contratos-body");
      if (!contratosBody) return;

      contratosBody.innerHTML = "";
      if (contratos.length === 0) {
        contratosBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-white-50">No hay contratos activos</td></tr>`;
        return;
      }

      contratos.forEach(c => {
        const formattedDate = new Date(c.created_at).toLocaleDateString('es-CO');
        contratosBody.innerHTML += `
          <tr data-id="${c.id}" data-type="contrato" class="admin-table-row" title="Haga clic para ver los detalles de este contrato">
            <td class="text-center fw-bold text-white-50">#${c.id}</td>
            <td><span class="badge bg-success font-monospace admin-card-h6">${c.codigo_contrato}</span></td>
            <td class="text-white fw-bold">${c.cliente_nombre}</td>
            <td class="small">${formattedDate}</td>
            <td class="text-center"><span class="badge bg-success">${c.estado}</span></td>
          </tr>
        `;
      });
    }

    static showNotification(message) {
      const notif = document.getElementById("admin-notification");
      const textSpan = document.getElementById("notification-text");
      if (notif && textSpan) {
        textSpan.textContent = message;
        notif.classList.remove("d-none");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          notif.classList.add("d-none");
        }, 4000);
      }
    }
  }

  // Expose to global window scope
  window.AdminView = AdminView;

})();
