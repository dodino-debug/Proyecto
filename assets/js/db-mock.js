// DOVI S.A.S. - MVC Bootstrap & Facade Loader
// Loads the Models, Views, and Controllers, and exposes a backwards-compatible DB facade.

(function() {
  "use strict";

  // Read base path from the <html> tag for robust routing on GitHub Pages & Localhost
  const basePath = document.documentElement.getAttribute('data-base-path') || './';

  // List of MVC scripts in strict dependency order
  const mvcScripts = [
    "src/Models/Database.js",
    "src/Models/UserModel.js",
    "src/Models/SolicitudModel.js",
    "src/Models/ContratoModel.js",
    "src/Models/PagoModel.js",
    "src/views/HeaderView.js",
    "src/views/FooterView.js",
    "src/views/AdminView.js",
    "src/views/ContractView.js",
    "src/Controller/AuthController.js",
    "src/Controller/AdminController.js",
    "src/Controller/ContractController.js",
    "src/Controller/HomeController.js"
  ];

  // Inject script tags synchronously so they are parsed and ready before any page inline scripts run
  mvcScripts.forEach(scriptPath => {
    document.write(`<script src="${basePath}${scriptPath}"></script>`);
  });

  // Create the DB facade wrapper to redirect old API calls to the new MVC modules
  window.DB = {
    getUsers: function() {
      return window.UserModel.getAll();
    },
    saveUsers: function(users) {
      window.UserModel.saveAll(users);
    },
    getSolicitudes: function() {
      return window.SolicitudModel.getAll();
    },
    saveSolicitudes: function(sol) {
      window.SolicitudModel.saveAll(sol);
    },
    getContratos: function() {
      return window.ContratoModel.getAll();
    },
    saveContratos: function(con) {
      window.ContratoModel.saveAll(con);
    },
    getPagos: function() {
      return window.PagoModel.getAll();
    },
    savePagos: function(pagos) {
      window.PagoModel.saveAll(pagos);
    },
    getCurrentUser: function() {
      return window.UserModel.getCurrentUser();
    },
    login: function(email, password) {
      return window.UserModel.login(email, password);
    },
    logout: function() {
      window.AuthController.logout();
    },
    register: function(userData) {
      return window.UserModel.register(userData);
    },
    addSolicitud: function(solData) {
      return window.SolicitudModel.add(solData);
    },
    updateSolicitudEstado: function(id, nuevoEstado) {
      return window.SolicitudModel.updateEstado(id, nuevoEstado);
    },
    updatePagoEstado: function(id, nuevoEstado) {
      return window.PagoModel.updateEstado(id, nuevoEstado);
    },
    getStats: function() {
      return window.PagoModel.getStats();
    }
  };

})();
