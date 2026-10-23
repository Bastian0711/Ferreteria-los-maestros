import {
  crearUsuario,
  listarUsuarios,
  obtenerUsuario,
  buscarUsuarioPorCorreo,
  crearProducto,
  listarProductos,
  listarPedidos,
  reiniciarBase,
} from "./baseDatos";

const USUARIO_NUEVO = {
  nombre: "Pedro",
  apellidos: "Araya Lagos",
  correo: "pedro@correo.cl",
  contrasena: "Pedro123!",
};

describe("baseDatos", () => {
  beforeEach(() => {
    localStorage.clear();
    reiniciarBase();
  });

  describe("usuarios", () => {
    it("trae los tres usuarios de la semilla", () => {
      // Arrange + Act
      const usuarios = listarUsuarios();

      // Assert
      expect(usuarios).toHaveLength(3);
    });

    it("no expone las contraseñas al listar usuarios", () => {
      // Arrange + Act
      const usuarios = listarUsuarios();

      // Assert
      expect(usuarios.every((u) => !("contrasena" in u))).toBe(true);
    });

    it("obtiene un usuario por id sin su contraseña", () => {
      // Arrange
      const id = 1;

      // Act
      const usuario = obtenerUsuario(id);

      // Assert
      expect(usuario.correo).toBe("admin@maestros.cl");
      expect(usuario).not.toHaveProperty("contrasena");
    });

    it("busca por correo ignorando mayúsculas y espacios", () => {
      // Arrange
      const correo = "  ADMIN@maestros.CL ";

      // Act
      const usuario = buscarUsuarioPorCorreo(correo);

      // Assert
      expect(usuario.id).toBe(1);
    });

    it("crea un usuario cliente con el siguiente id", () => {
      // Arrange + Act
      const creado = crearUsuario(USUARIO_NUEVO);

      // Assert
      expect(creado.id).toBe(4);
      expect(creado.rol).toBe("cliente");
      expect(listarUsuarios()).toHaveLength(4);
    });

    it("rechaza un correo que ya está registrado", () => {
      // Arrange
      const datos = { ...USUARIO_NUEVO, correo: "ADMIN@maestros.cl" };

      // Act
      const crear = () => crearUsuario(datos);

      // Assert
      expect(crear).toThrow("Ya existe una cuenta con ese correo.");
    });

    it("rechaza un usuario sin correo", () => {
      // Arrange
      const datos = { ...USUARIO_NUEVO, correo: "" };

      // Act
      const crear = () => crearUsuario(datos);

      // Assert
      expect(crear).toThrow("El correo es obligatorio.");
    });
  });

  describe("reiniciarBase", () => {
    it("vuelve a los datos de la semilla", () => {
      // Arrange
      crearProducto({ codigo: "ZZ001", nombre: "Temporal", precioVenta: 100 });
      crearUsuario(USUARIO_NUEVO);

      // Act
      reiniciarBase();

      // Assert
      expect(listarProductos()).toHaveLength(85);
      expect(listarUsuarios()).toHaveLength(3);
      expect(listarPedidos()).toHaveLength(0);
    });
  });
});
