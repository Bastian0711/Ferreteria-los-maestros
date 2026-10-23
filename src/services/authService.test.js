import { autenticar } from "./authService";
import { buscarUsuarioPorCorreo, reiniciarBase } from "../data/baseDatos";
import { validarContrasena } from "../utils/validaciones";

const CORREOS_SEMILLA = [
  "admin@maestros.cl",
  "contratista@maestros.cl",
  "cliente@maestros.cl",
];

describe("authService", () => {
  beforeEach(() => {
    localStorage.clear();
    reiniciarBase();
  });

  it.each(CORREOS_SEMILLA)(
    "la contraseña de la semilla de %s cumple las reglas de validarContrasena",
    (correo) => {
      // Arrange
      const usuario = buscarUsuarioPorCorreo(correo);

      // Act
      const error = validarContrasena(usuario.contrasena);

      // Assert
      expect(error).toBe("");
    }
  );

  it("autentica al administrador con credenciales correctas", () => {
    // Arrange
    const correo = "admin@maestros.cl";
    const contrasena = "Admin123!";

    // Act
    const usuario = autenticar(correo, contrasena);

    // Assert
    expect(usuario).not.toBeNull();
    expect(usuario.rol).toBe("admin");
  });

  it("no expone la contraseña en el usuario devuelto", () => {
    // Arrange
    const correo = "cliente@maestros.cl";

    // Act
    const usuario = autenticar(correo, "Cliente123!");

    // Assert
    expect(usuario).not.toHaveProperty("contrasena");
  });

  it("devuelve null si la contraseña es incorrecta", () => {
    // Arrange
    const contrasenaErronea = "Otra123!";

    // Act
    const usuario = autenticar("admin@maestros.cl", contrasenaErronea);

    // Assert
    expect(usuario).toBeNull();
  });

  it("devuelve null si el correo no existe", () => {
    // Arrange
    const correoInexistente = "nadie@maestros.cl";

    // Act
    const usuario = autenticar(correoInexistente, "Admin123!");

    // Assert
    expect(usuario).toBeNull();
  });

  it("ignora mayúsculas y espacios en el correo", () => {
    // Arrange
    const correoConFormato = "  ADMIN@Maestros.cl ";

    // Act
    const usuario = autenticar(correoConFormato, "Admin123!");

    // Assert
    expect(usuario).not.toBeNull();
  });
});
