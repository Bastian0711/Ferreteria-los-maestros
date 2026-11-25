import { vi } from "vitest";
import { listarUsuarios, crearUsuario, actualizarUsuario, desactivarUsuario, listarRoles } from "./usuariosService";
import { apiUsuarios } from "./api";

vi.mock("./api", async (importOriginal) => {
  const original = await importOriginal();
  return { ...original, apiUsuarios: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() } };
});

describe("usuariosService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lista los usuarios con GET /usuarios", async () => {
    // Arrange
    apiUsuarios.get.mockResolvedValue({ data: [{ id: 1, correo: "admin@maestros.cl" }] });

    // Act
    const usuarios = await listarUsuarios();

    // Assert
    expect(apiUsuarios.get).toHaveBeenCalledWith("/usuarios");
    expect(usuarios).toHaveLength(1);
  });

  it("lista los roles con GET /roles", async () => {
    // Arrange
    apiUsuarios.get.mockResolvedValue({ data: [{ id: 1, nombre: "admin" }] });

    // Act + Assert
    expect(await listarRoles()).toEqual([{ id: 1, nombre: "admin" }]);
    expect(apiUsuarios.get).toHaveBeenCalledWith("/roles");
  });

  it("crea un usuario enviando password y rol", async () => {
    // Arrange
    apiUsuarios.post.mockResolvedValue({ data: { id: 9 } });

    // Act
    await crearUsuario({ nombre: "Luis", apellidos: "Vende", correo: "luis@maestros.cl", contrasena: "Luis1234!", rol: "vendedor" });

    // Assert
    expect(apiUsuarios.post).toHaveBeenCalledWith("/usuarios", {
      nombre: "Luis", apellidos: "Vende", correo: "luis@maestros.cl", password: "Luis1234!", direccion: "", rol: "vendedor",
    });
  });

  it("muestra el mensaje del backend si el correo ya existe (409)", async () => {
    // Arrange
    apiUsuarios.post.mockRejectedValue({ response: { status: 409, data: { mensaje: "Ya existe una cuenta con ese correo.", detalles: [] } } });

    // Act + Assert
    await expect(crearUsuario({ nombre: "A", apellidos: "B", correo: "admin@maestros.cl", contrasena: "Clave123!", rol: "cliente" }))
      .rejects.toThrow("Ya existe una cuenta con ese correo.");
  });

  it("modifica un usuario con PUT /usuarios/{id}", async () => {
    // Arrange
    apiUsuarios.put.mockResolvedValue({ data: { id: 4, rol: "vendedor" } });

    // Act
    await actualizarUsuario(4, { nombre: "Camila", apellidos: "Soto", direccion: "", rol: "vendedor", activo: true });

    // Assert
    expect(apiUsuarios.put).toHaveBeenCalledWith("/usuarios/4", {
      nombre: "Camila", apellidos: "Soto", direccion: "", rol: "vendedor", activo: true,
    });
  });

  it("desactiva un usuario con DELETE /usuarios/{id}", async () => {
    // Arrange
    apiUsuarios.delete.mockResolvedValue({ data: "" });

    // Act
    await desactivarUsuario(4);

    // Assert
    expect(apiUsuarios.delete).toHaveBeenCalledWith("/usuarios/4");
  });
});
