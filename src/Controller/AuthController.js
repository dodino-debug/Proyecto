// DOVI S.A.S. - Controllers: AuthController
// Handles security checks, authentication requests, register workflows, and updates navigation.

(function() {
  "use strict";

  class AuthController {
    // Check if the current user has access to Admin pages
    static checkAdminAccess() {
      const currentUser = window.UserModel.getCurrentUser();
      if (!currentUser || currentUser.rol !== "Administrador") {
        sessionStorage.setItem("admin_error", "Acceso denegado. Se requieren permisos de Administrador.");
        const basePath = document.documentElement.getAttribute('data-base-path') || './';
        window.location.replace(`${basePath}login.html`);
      }
    }

    // Handles the login form submission
    static handleLogin(email, password, errorAlertId, errorTextId) {
      const errorAlert = document.getElementById(errorAlertId);
      if (errorAlert) errorAlert.classList.add("d-none"); // Custom CSS class

      const result = window.UserModel.login(email, password);
      
      const basePath = document.documentElement.getAttribute('data-base-path') || './';
      if (result.success) {
        if (result.user.rol === "Administrador") {
          window.location.href = `${basePath}admin.html`;
        } else {
          window.location.href = `${basePath}index.html`;
        }
      } else {
        const textSpan = document.getElementById(errorTextId);
        if (textSpan) textSpan.textContent = result.error;
        if (errorAlert) errorAlert.classList.remove("d-none");
      }
    }

    // Handles the registration form submission
    static handleRegister(userData, errorAlertId, errorAlertTextId) {
      const errorAlert = document.getElementById(errorAlertId);
      if (errorAlert) errorAlert.classList.add("d-none");

      const result = window.UserModel.register(userData);
      
      const basePath = document.documentElement.getAttribute('data-base-path') || './';
      if (result.success) {
        window.location.href = `${basePath}index.html`;
      } else {
        const textSpan = document.getElementById(errorAlertTextId);
        if (textSpan) textSpan.textContent = result.error;
        if (errorAlert) errorAlert.classList.remove("d-none");
      }
    }

    // Handles user logout
    static logout() {
      window.UserModel.logout();
      const basePath = document.documentElement.getAttribute('data-base-path') || './';
      window.location.href = `${basePath}index.html`;
    }

    // Updates page layout based on active user status
    static updateLayout() {
      window.HeaderView.renderHeader();
    }

    // Initializes the Login view behaviors
    static initLogin() {
      // Check if we came from access denial redirection
      if (sessionStorage.getItem("admin_error")) {
        const redirectMsg = document.getElementById("redirect-message");
        if (redirectMsg) redirectMsg.classList.remove("d-none");
        sessionStorage.removeItem("admin_error");
      }

      const loginForm = document.getElementById("login-form");
      if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
          e.preventDefault();
          const email = document.getElementById("email").value.trim();
          const password = document.getElementById("password").value;
          AuthController.handleLogin(email, password, "login-error", "error-text");
        });
      }
    }

    // Initializes the Register view behaviors
    static initRegister() {
      const form = document.getElementById('formRegistro');
      const passInput = document.getElementById('password');
      const confirmPassInput = document.getElementById('confirmPassword');
      const errorAlert = document.getElementById('errorAlert');

      if (form) {
        form.addEventListener('submit', function(event) {
          event.preventDefault(); 
          if (errorAlert) errorAlert.classList.add('d-none');

          if (passInput.value !== confirmPassInput.value) {
            const errorAlertText = document.getElementById('errorAlertText');
            if (errorAlertText) errorAlertText.textContent = 'Las contraseñas no coinciden.';
            if (errorAlert) errorAlert.classList.remove('d-none');
            passInput.value = '';
            confirmPassInput.value = '';
            passInput.focus(); 
            return;
          }

          const userData = {
            nombre: document.getElementById('nombre').value.trim(),
            apellido: document.getElementById('apellido').value.trim(),
            tipo_documento: document.getElementById('tipo_documento').value,
            numero_documento: document.getElementById('numero_documento').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            direccion: document.getElementById('direccion').value.trim(),
            email: document.getElementById('correo').value.trim(),
            password: passInput.value
          };

          AuthController.handleRegister(userData, 'errorAlert', 'errorAlertText');
        });

        const ocultarAlerta = () => {
          if (errorAlert && !errorAlert.classList.contains('d-none')) {
            errorAlert.classList.add('d-none');
          }
        };

        if (passInput) passInput.addEventListener('input', ocultarAlerta);
        if (confirmPassInput) confirmPassInput.addEventListener('input', ocultarAlerta);
      }
    }
  }

  // Expose to global window scope
  window.AuthController = AuthController;

})();
