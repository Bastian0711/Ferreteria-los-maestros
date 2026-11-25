import { vi } from "vitest";
import { autenticar, adaptarUsuario } from "./authService";
import { apiUsuarios } from "./api";

// Se simula la API: no se llama a un servidor real
vi.mock("./api", async (importOriginal) => {
  const original = await importOriginal();
  return { ...original, apiUsuarios: { post: vi.fn() } };
});

const USUARIO_API = { id: 1, nombre: "Administrador", correo: "admin@maestros.cl", rol: "admin", activo: true };

describe("authService.autenticar", () => {
  beforeEach(() => {
    apiUsuarios.post.mockReset();
  });

  it("envía correo y password a /auth/login y devuelve token y usuario", async () => {
    // Arrange
    apiUsuarios.post.mockResolvedValue({ data: { accessToken: "token-123", usuario: USUARIO_API } });

    // Act
    const sesion = await autenticar(" admin@maestros.cl ", "Admin123!");

    // Assert
    expect(apiUsuarios.post).toHaveBeenCalledWith("/auth/login", { correo: "admin@maestros.cl", password: "Admin123!" });
    expect(sesion.token).toBe("token-123");
    expect(sesion.usuario.correo).toBe("admin@maestros.cl");
  });

  it("devuelve null si el backend responde 401", async () => {
    // Arrange
    apiUsuarios.post.mockRejectedValue({ response: { status: 401, data: { mensaje: "Correo o contrasena incorrectos." } } });

    // Act
    const sesion = await autenticar("admin@maestros.cl", "Mala123!");

    // Assert
    expect(sesion).toBeNull();
  });

  it("lanza un error claro si no hay conexión con el servidor", async () => {
    // Arrange
    apiUsuarios.post.mockRejectedValue({ message: "Network Error" });

    // Act + Assert
    await expect(autenticar("admin@maestros.cl", "Admin123!")).rejects.toThrow("No pudimos conectar con el servidor");
  });

  it("lanza el mensaje del backend ante otros errores", async () => {
    // Arrange
    apiUsuarios.post.mockRejectedValue({ response: { status: 500, data: { mensaje: "Error interno del servidor." } } });

    // Act + Assert
    await expect(autenticar("admin@maestros.cl", "Admin123!")).rejects.toThrow("Error interno del servidor.");
  });
});

describe("authService.adaptarUsuario", () => {
  it("marca con cuenta corriente al contratista", () => {
    // Arrange + Act + Assert
    expect(adaptarUsuario({ id: 3, rol: "contratista" }).cuentaCorriente).toBe(true);
  });

  it("deja sin cuenta corriente a los demás roles", () => {
    // Arrange + Act + Assert
    expect(adaptarUsuario({ id: 4, rol: "cliente" }).cuentaCorriente).toBe(false);
    expect(adaptarUsuario({ id: 1, rol: "admin" }).cuentaCorriente).toBe(false);
  });
});
