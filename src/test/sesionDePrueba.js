import { CLAVE_SESION } from "../services/sesion";

function aBase64Url(objeto) {
  return btoa(JSON.stringify(objeto)).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

// Token con la forma de un JWT y vencimiento en "segundos" desde ahora (negativo = ya vencido).
// La firma es falsa: el frontend solo lee "exp"; la firma la verifica el backend.
export function crearTokenDePrueba(segundos = 3600) {
  const exp = Math.floor(Date.now() / 1000) + segundos;
  return `${aBase64Url({ alg: "HS256", typ: "JWT" })}.${aBase64Url({ sub: "prueba", exp })}.firma`;
}

// Deja una sesión iniciada en sessionStorage, como si el usuario ya hubiera entrado
export function iniciarSesionDePrueba(usuario, segundos = 3600) {
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify({ token: crearTokenDePrueba(segundos), usuario }));
}
