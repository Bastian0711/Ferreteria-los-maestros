import { CLAVE_SESION, guardarSesion, leerSesion, borrarSesion, leerToken, tokenVencido, vencimientoToken } from "./sesion";
import { crearTokenDePrueba } from "../test/sesionDePrueba";

const USUARIO = { id: 4, correo: "cliente@maestros.cl", rol: "cliente" };

describe("sesion", () => {
  it("lee el vencimiento (exp) del token en milisegundos", () => {
    // Arrange
    const token = crearTokenDePrueba(60);

    // Act
    const vencimiento = vencimientoToken(token);

    // Assert
    expect(vencimiento).toBeGreaterThan(Date.now());
    expect(vencimiento).toBeLessThanOrEqual(Date.now() + 60000);
  });

  it("devuelve null si el token no tiene el formato de un JWT", () => {
    // Arrange + Act + Assert
    expect(vencimientoToken("esto-no-es-un-token")).toBeNull();
  });

  it("considera vencido un token cuyo exp ya pasó", () => {
    // Arrange + Act + Assert
    expect(tokenVencido(crearTokenDePrueba(-10))).toBe(true);
    expect(tokenVencido(crearTokenDePrueba(3600))).toBe(false);
  });

  it("guarda y recupera la sesión desde sessionStorage", () => {
    // Arrange
    const sesion = { token: crearTokenDePrueba(), usuario: USUARIO };

    // Act
    guardarSesion(sesion);

    // Assert
    expect(leerSesion()).toEqual(sesion);
    expect(leerToken()).toBe(sesion.token);
  });

  it("descarta una sesión con el token vencido", () => {
    // Arrange
    guardarSesion({ token: crearTokenDePrueba(-10), usuario: USUARIO });

    // Act
    const sesion = leerSesion();

    // Assert
    expect(sesion).toBeNull();
    expect(sessionStorage.getItem(CLAVE_SESION)).toBeNull();
  });

  it("devuelve null si lo guardado no es JSON válido", () => {
    // Arrange
    sessionStorage.setItem(CLAVE_SESION, "{esto no es json");

    // Act + Assert
    expect(leerSesion()).toBeNull();
    expect(leerToken()).toBeNull();
  });

  it("borra la sesión", () => {
    // Arrange
    guardarSesion({ token: crearTokenDePrueba(), usuario: USUARIO });

    // Act
    borrarSesion();

    // Assert
    expect(leerSesion()).toBeNull();
  });
});
