// DOVI S.A.S. - Models: Database
// Handles seeding of initial mock data and generic read/write helper operations for localStorage.

(function() {
  "use strict";

  const defaultUsers = [
    {
      id: 1,
      email: "admin@dovi.com",
      password: "admin",
      nombre: "Administrador",
      apellido: "DOVI",
      rol: "Administrador",
      estado: "Activo"
    },
    {
      id: 2,
      email: "cliente@dovi.com",
      password: "cliente",
      nombre: "Juan",
      apellido: "Pérez",
      rol: "Cliente",
      estado: "Activo",
      tipo_documento: "CC",
      numero_documento: "10203040",
      telefono: "3001234567",
      direccion: "Calle 123 #45-67, Valledupar"
    }
  ];

  const defaultSolicitudes = [
    {
      id: 101,
      cliente_nombre: "Juan Pérez",
      cliente_email: "cliente@dovi.com",
      tipo_solicitud: "Maquinaria",
      id_maquina: "retroexcavadora",
      nombre_maquina: "Retroexcavadora",
      id_servicio: null,
      nombre_servicio: null,
      fecha_inicio: "2026-07-01",
      fecha_fin: "2026-07-15",
      direccion_servicio: "Finca La Esperanza, Codazzi",
      descripcion_detallada: "Excavación de zanjas para canales de riego.",
      estado: "Pendiente",
      created_at: "2026-06-14T10:30:00Z"
    },
    {
      id: 102,
      cliente_nombre: "María Rodríguez",
      cliente_email: "maria@correo.com",
      tipo_solicitud: "Servicio",
      id_maquina: null,
      nombre_maquina: null,
      id_servicio: "preparacion-terrenos",
      nombre_servicio: "Preparación de Terrenos",
      fecha_inicio: "2026-06-20",
      fecha_fin: "2026-06-25",
      direccion_servicio: "Vereda El Guamo, San Martín",
      descripcion_detallada: "Adecuación de 10 hectáreas para siembra de maíz.",
      estado: "Aprobada",
      created_at: "2026-06-12T08:15:00Z"
    },
    {
      id: 103,
      cliente_nombre: "Agropecuaria del Cesar",
      cliente_email: "contacto@agrocesar.com",
      tipo_solicitud: "Ambos",
      id_maquina: "bulldozer",
      nombre_maquina: "Bulldozer",
      id_servicio: "siembra-cultivo",
      nombre_servicio: "Siembra y Cultivo",
      fecha_inicio: "2026-08-01",
      fecha_fin: "2026-08-30",
      direccion_servicio: "Vía Bosconia Km 12",
      descripcion_detallada: "Remoción de capa vegetal y posterior siembra de pasturas.",
      estado: "Rechazada",
      created_at: "2026-06-10T14:45:00Z"
    }
  ];

  const defaultContratos = [
    {
      id: 501,
      cliente_nombre: "María Rodríguez",
      codigo_contrato: "CON-2026-001",
      estado: "Activo",
      created_at: "2026-06-13T09:00:00Z"
    }
  ];

  const defaultPagos = [
    {
      id: 1001,
      id_contrato: 501,
      codigo_contrato: "CON-2026-001",
      cliente_nombre: "María Rodríguez",
      cliente_email: "maria@correo.com",
      monto: 3500000,
      estado: "Verificado",
      created_at: "2026-06-14T11:00:00Z"
    },
    {
      id: 1002,
      id_contrato: 501,
      codigo_contrato: "CON-2026-001",
      cliente_nombre: "María Rodríguez",
      cliente_email: "maria@correo.com",
      monto: 1500000,
      estado: "Pendiente",
      created_at: "2026-06-15T15:20:00Z"
    }
  ];

  const defaultServicios = [
    { id: 1, nombre: "Preparación de Terrenos", slug: "preparacion-terrenos", estado: "Activo" },
    { id: 2, nombre: "Siembra y Cultivo", slug: "siembra-cultivo", estado: "Activo" },
    { id: 3, nombre: "Mantenimiento de Cultivos", slug: "mantenimiento-cultivos", estado: "Activo" },
    { id: 4, nombre: "Fumigación y Aplicación", slug: "fumigacion-aplicacion", estado: "Activo" },
    { id: 5, nombre: "Asistencia Agrícola", slug: "asistencia-agricola", estado: "Activo" },
    { id: 6, nombre: "Servicios Generales", slug: "servicios-generales", estado: "Activo" }
  ];

  const defaultMaquinaria = [
    { id: 1, nombre: "Retroexcavadora", slug: "retroexcavadora", estado: "Disponible" },
    { id: 2, nombre: "Bulldozer", slug: "bulldozer", estado: "Disponible" },
    { id: 3, nombre: "Cargador Frontal", slug: "cargador-frontal", estado: "Disponible" },
    { id: 4, nombre: "Minicargador", slug: "minicargador", estado: "Disponible" },
    { id: 5, nombre: "Bolqueta", slug: "bolqueta", estado: "Disponible" },
    { id: 6, nombre: "Motoniveladora", slug: "motoniveladora", estado: "Mantenimiento" }
  ];

  class Database {
    static init() {
      if (!localStorage.getItem("dovi_users")) {
        localStorage.setItem("dovi_users", JSON.stringify(defaultUsers));
      }
      if (!localStorage.getItem("dovi_solicitudes")) {
        localStorage.setItem("dovi_solicitudes", JSON.stringify(defaultSolicitudes));
      }
      if (!localStorage.getItem("dovi_contratos")) {
        localStorage.setItem("dovi_contratos", JSON.stringify(defaultContratos));
      }
      if (!localStorage.getItem("dovi_pagos")) {
        localStorage.setItem("dovi_pagos", JSON.stringify(defaultPagos));
      }
      if (!localStorage.getItem("dovi_servicios")) {
        localStorage.setItem("dovi_servicios", JSON.stringify(defaultServicios));
      }
      if (!localStorage.getItem("dovi_maquinaria")) {
        localStorage.setItem("dovi_maquinaria", JSON.stringify(defaultMaquinaria));
      }
    }

    static read(key) {
      this.init();
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    }

    static write(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  // Expose to global window scope
  window.Database = Database;
  Database.init();

})();
