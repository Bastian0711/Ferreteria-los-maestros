import { AxiosError } from "axios";
import { vi } from "vitest";
import { crearClienteApi, mensajeDeError, EVENTO_SESION_EXPIRADA } from "./api";
import { iniciarSesionDePrueba } from "../test/sesionDePrueba";

// Reemplaza la red por una función: devuelve lo que el test necesite sin llamar a un servidor
function clienteConRespuesta(responder) {
  const cliente = crearClienteApi("http://api.prueba/api/v1");
  cliente.defaults.adapter = responder;
  return cliente;
}

describe("api", () => {
  it("agrega el token en la cabecera Authorization cuando hay sesión", async () => {
    // Arrange
    iniciarSesionDePrueba({ id: 1, rol: "admin" });
    let cabeceras;
    const cliente = clienteConRespuesta(async (config) => {
      cabeceras = config.headers;
      return { data: {}, status: 200, statusText: "OK", headers: {}, config };
    });

    // Act
    await cliente.get("/usuarios");

    // Assert
    expect(cabeceras.Authorization).toMatch(/^Bearer /);
  });

  it("no agrega Authorization si no hay sesión", async () => {
    // Arrange
    let cabeceras;
    const cliente = clienteConRespuesta(async (config) => {
      cabeceras = config.headers;
      return { data: {}, status: 200, statusText: "OK", headers: {}, config };
    });

    // Act
    await cliente.get("/productos");

    // Assert
    expect(cabeceras.Authorization).toBeUndefined();
  });

  it("avisa que la sesión expiró si una petición con token recibe 401", async () => {
    // Arrange
    iniciarSesionDePrueba({ id: 1, rol: "admin" });
    const alExpirar = vi.fn();
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
    const cliente = clienteConRespuesta(async (config) => {
      throw new AxiosError("No autorizado", "ERR_BAD_REQUEST", config, null,
        { status: 401, data: {}, statusText: "Unauthorized", headers: {}, config });
    });

    // Act
    await expect(cliente.get("/usuarios")).rejects.toBeInstanceOf(AxiosError);

    // Assert
    expect(alExpirar).toHaveBeenCalledTimes(1);
    window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
  });

  it("mensajeDeError explica cuando no hay conexión con el servidor", () => {
    // Arrange + Act + Assert
    expect(mensajeDeError({ message: "Network Error" })).toMatch("No pudimos conectar con el servidor");
  });

  it("mensajeDeError usa el mensaje del backend", () => {
    // Arrange
    const error = { response: { status: 409, data: { mensaje: "Ya existe una cuenta con ese correo.", detalles: [] } } };

    // Act + Assert
    expect(mensajeDeError(error)).toBe("Ya existe una cuenta con ese correo.");
  });

  it("mensajeDeError muestra los detalles de validación sin el nombre del campo", () => {
    // Arrange
    const error = { response: { status: 400, data: { mensaje: "Datos invalidos.", detalles: ["correo: formato no valido"] } } };

    // Act + Assert
    expect(mensajeDeError(error)).toBe("formato no valido");
  });

  it("mensajeDeError usa el texto por defecto si el backend no envía mensaje", () => {
    // Arrange + Act + Assert
    expect(mensajeDeError({ response: { status: 500, data: {} } }, "Falló")).toBe("Falló");
  });
});
