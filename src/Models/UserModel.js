// DOVI S.A.S. - Models: UserModel
// Encapsulates User authentication and profile persistence operations.

(function() {
  "use strict";

  class UserModel {
    static getAll() {
      return window.Database.read("dovi_users");
    }

    static saveAll(users) {
      window.Database.write("dovi_users", users);
    }

    static getCurrentUser() {
      const user = localStorage.getItem("dovi_currentUser");
      return user ? JSON.parse(user) : null;
    }

    static setCurrentUser(user) {
      if (user) {
        localStorage.setItem("dovi_currentUser", JSON.stringify(user));
      } else {
        localStorage.removeItem("dovi_currentUser");
      }
    }

    static login(email, password) {
      const users = this.getAll();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      
      if (user) {
        if (user.estado !== "Activo") {
          return { success: false, error: "Su cuenta está inactiva. Contacte al administrador." };
        }
        this.setCurrentUser(user);
        return { success: true, user: user };
      }
      return { success: false, error: "Correo electrónico o contraseña incorrectos." };
    }

    static register(userData) {
      const users = this.getAll();
      
      const emailExists = users.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
      if (emailExists) {
        return { success: false, error: "El correo electrónico ya está registrado." };
      }

      const docExists = users.some(u => u.numero_documento === userData.numero_documento);
      if (docExists) {
        return { success: false, error: "El número de documento ya está registrado." };
      }

      const maxId = users.reduce((max, u) => u.id > max ? u.id : max, 0);
      const newId = maxId > 0 ? maxId + 1 : 3;

      const newUser = {
        id: newId,
        email: userData.email,
        password: userData.password,
        nombre: userData.nombre,
        apellido: userData.apellido,
        rol: "Cliente",
        estado: "Activo",
        tipo_documento: userData.tipo_documento,
        numero_documento: userData.numero_documento,
        telefono: userData.telefono,
        direccion: userData.direccion
      };

      users.push(newUser);
      this.saveAll(users);
      this.setCurrentUser(newUser);

      return { success: true, user: newUser };
    }

    static logout() {
      this.setCurrentUser(null);
    }
  }

  // Expose to global window scope
  window.UserModel = UserModel;

})();
