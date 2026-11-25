import { vi } from "vitest";
import { registrarUsuario } from "./authService";
import { apiUsuarios } from "./api";

vi.mock("./api", async (importOriginal) => {
  const original = await importOriginal();
  return { ...original, apiUsuarios: { post: vi.fn() } };
});

const DATOS = { nombre: " Ana ", apellidos: " Pérez Soto ", correo: "ana@correo.cl", contrasena: "Nueva123!", direccion: "" };
const NUEVA = { id: 7, nombre: "Ana", apellidos: "Pérez Soto", correo: "ana@correo.cl", rol: "cliente", activo: true };

describe("authService.registrarUsuario", () => {
  beforeEach(() => {
    apiUsuarios.post.mockReset();
  });

  it("crea la cuenta en el backend y luego inicia sesión", async () => {
    // Arrange
    apiUsuarios.post
      .mockResolvedValueOnce({ data: NUEVA })
      .mockResolvedValueOnce({ data: { accessToken: "token-nuevo", usuario: NUEVA } });

    // Act
    const sesion = await registrarUsuario(DATOS);

    // Assert
    expect(apiUsuarios.post).toHaveBeenNthCalledWith(1, "/auth/registro", {
      nombre: "Ana", apellidos: "Pérez Soto", correo: "ana@correo.cl", password: "Nueva123!", direccion: "",
    });
    expect(apiUsuarios.post).toHaveBeenNthCalledWith(2, "/auth/login", { correo: "ana@correo.cl", password: "Nueva123!" });
    expect(sesion.token).toBe("token-nuevo");
    expect(sesion.usuario.rol).toBe("cliente");
  });

  it("no envía rol: lo asigna el backend", async () => {
    // Arrange
    apiUsuarios.post
      .mockResolvedValueOnce({ data: NUEVA })
      .mockResolvedValueOnce({ data: { accessToken: "t", usuario: NUEVA } });

    // Act
    await registrarUsuario({ ...DATOS, rol: "admin" });

    // Assert
    expect(apiUsuarios.post.mock.calls[0][1]).not.toHaveProperty("rol");
  });

  it("muestra el mensaje del backend si el correo ya existe (409)", async () => {
    // Arrange
    apiUsuarios.post.mockRejectedValue({ response: { status: 409, data: { mensaje: "Ya existe una cuenta con ese correo.", detalles: [] } } });

    // Act + Assert
    await expect(registrarUsuario(DATOS)).rejects.toThrow("Ya existe una cuenta con ese correo.");
  });

  it("rechaza una contraseña débil sin llamar a la API", async () => {
    // Arrange + Act + Assert
    await expect(registrarUsuario({ ...DATOS, contrasena: "1234" })).rejects.toThrow();
    expect(apiUsuarios.post).not.toHaveBeenCalled();
  });

  it("rechaza un nombre vacío sin llamar a la API", async () => {
    // Arrange + Act + Assert
    await expect(registrarUsuario({ ...DATOS, nombre: "   " })).rejects.toThrow("El nombre es obligatorio.");
    expect(apiUsuarios.post).not.toHaveBeenCalled();
  });

  it("rechaza apellidos vacíos sin llamar a la API", async () => {
    // Arrange + Act + Assert
    await expect(registrarUsuario({ ...DATOS, apellidos: "" })).rejects.toThrow("Los apellidos son obligatorios.");
    expect(apiUsuarios.post).not.toHaveBeenCalled();
  });

  it("avisa si la cuenta se creó pero el inicio de sesión falla", async () => {
    // Arrange
    apiUsuarios.post
      .mockResolvedValueOnce({ data: NUEVA })
      .mockRejectedValueOnce({ response: { status: 401, data: {} } });

    // Act + Assert
    await expect(registrarUsuario(DATOS)).rejects.toThrow("La cuenta se creó");
  });
});
