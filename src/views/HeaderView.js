// DOVI S.A.S. - Views: HeaderView
// Manages dynamic loading and rendering of navigation controls and authentication status in the page header.

(function() {
  "use strict";

  class HeaderView {
    static async renderHeader() {
      const basePath = document.documentElement.getAttribute('data-base-path') || './';
      
      // 1. Standard Header
      const headerElement = document.querySelector("#header");
      if (headerElement) {
        try {
          const response = await fetch(`${basePath}src/views/components/header.html`);
          if (!response.ok) {
            throw new Error(`Failed to fetch header: ${response.statusText}`);
          }
          let html = await response.text();
          // Replace all path placeholders
          html = html.replace(/\{\{BASE_PATH\}\}/g, basePath);
          headerElement.innerHTML = html;

          // Perform dynamic layouts based on user auth status
          this.updateAuthState();
        } catch (error) {
          console.error("HeaderView Render Error:", error);
        }
      }

      // 2. Auth Header
      const authHeaderElement = document.querySelector("#auth-header");
      if (authHeaderElement) {
        try {
          const response = await fetch(`${basePath}src/views/components/auth_header.html`);
          if (!response.ok) {
            throw new Error(`Failed to fetch auth header: ${response.statusText}`);
          }
          let html = await response.text();
          html = html.replace(/\{\{BASE_PATH\}\}/g, basePath);
          authHeaderElement.innerHTML = html;
        } catch (error) {
          console.error("AuthHeaderView Render Error:", error);
        }
      }
    }

    static updateAuthState() {
      const headerElement = document.querySelector("#header");
      if (!headerElement) return;

      const basePath = document.documentElement.getAttribute('data-base-path') || './';
      const currentUser = window.UserModel.getCurrentUser();

      // 1. Update navigation items (add Admin link if user is administrator)
      const navmenuUl = headerElement.querySelector(".navmenu ul");
      if (navmenuUl) {
        const existingAdminLink = navmenuUl.querySelector(".admin-nav-item");
        if (existingAdminLink) {
          existingAdminLink.remove();
        }

        if (currentUser && currentUser.rol === "Administrador") {
          const adminLi = document.createElement("li");
          adminLi.className = "admin-nav-item";
          adminLi.innerHTML = `<a href="${basePath}admin.html" class="orange-link fw-bold"><i class="bi bi-shield-lock"></i> Panel Admin</a>`;
          navmenuUl.appendChild(adminLi);
        }
      }

      // 2. Render Auth buttons (Login / Logged User state)
      let authContainer = document.getElementById("header-auth-buttons");
      if (!authContainer) {
        const containerDiv = headerElement.querySelector(".container");
        authContainer = document.createElement("div");
        authContainer.id = "header-auth-buttons";
        authContainer.className = "d-flex align-items-center gap-2";
        if (containerDiv) {
          containerDiv.appendChild(authContainer);
        }
      }

      if (currentUser) {
        const firstName = currentUser.nombre.split(" ")[0];
        authContainer.innerHTML = `
          <span class="text-white me-2 d-none d-md-inline">
            Hola, <strong>${firstName}</strong>
          </span>
          <button class="cta-btn border-0 contact-button-orange btn-logout-custom-style" id="btn-logout-mock">Cerrar Sesión</button>
        `;
        
        document.getElementById("btn-logout-mock").addEventListener("click", function() {
          window.AuthController.logout();
        });
      } else {
        authContainer.innerHTML = `
          <a class="cta-btn contact-button-orange text-decoration-none" href="${basePath}login.html">Iniciar Sesión</a>
        `;
      }
    }
  }

  // Expose to global window scope
  window.HeaderView = HeaderView;

})();
