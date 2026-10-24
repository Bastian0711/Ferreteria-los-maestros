import { autenticar, registrarUsuario } from "./authService";
import { reiniciarBase, buscarUsuarioPorCorreo } from "../data/baseDatos";

const DATOS = {
  nombre: "Ana",
  apellidos: "Pérez Soto",
  correo: "ana@correo.cl",
  contrasena: "Nueva123!",
  direccion: "Calle 1, La Serena",
};

describe("authService - registrarUsuario", () => {
  beforeEach(() => {
    localStorage.clear();
    reiniciarBase();
  });

  it("crea una cuenta de cliente sin exponer la contraseña", () => {
    // Arrange + Act
    const usuario = registrarUsuario(DATOS);

    // Assert
    expect(usuario.rol).toBe("cliente");
    expect(usuario.cuentaCorriente).toBe(false);
    expect(usuario).not.toHaveProperty("contrasena");
  });

  it("ignora un rol de administrador enviado en los datos", () => {
    // Arrange
    const datos = { ...DATOS, rol: "admin", cuentaCorriente: true };

    // Act
    const usuario = registrarUsuario(datos);

    // Assert
    expect(usuario.rol).toBe("cliente");
    expect(usuario.cuentaCorriente).toBe(false);
  });

  it("permite iniciar sesión con la cuenta recién creada", () => {
    // Arrange
    registrarUsuario(DATOS);

    // Act
    const usuario = autenticar("ana@correo.cl", "Nueva123!");

    // Assert
    expect(usuario).not.toBeNull();
    expect(buscarUsuarioPorCorreo("ana@correo.cl")).toBeDefined();
  });

  it("rechaza un correo que ya está registrado", () => {
    // Arrange
    const datos = { ...DATOS, correo: "cliente@maestros.cl" };

    // Act + Assert
    expect(() => registrarUsuario(datos)).toThrow("Ya existe una cuenta con ese correo.");
  });

  it("rechaza una contraseña débil", () => {
    // Arrange
    const datos = { ...DATOS, contrasena: "corta" };

    // Act + Assert
    expect(() => registrarUsuario(datos)).toThrow("La contraseña debe tener al menos 8 caracteres.");
  });

  it("rechaza un nombre vacío", () => {
    // Arrange
    const datos = { ...DATOS, nombre: "   " };

    // Act + Assert
    expect(() => registrarUsuario(datos)).toThrow("El nombre es obligatorio.");
  });
});
