// Sesión del usuario: token JWT + datos del usuario.
// Se guarda en sessionStorage: sobrevive a recargar la página y se borra al cerrar la pestaña.
export const CLAVE_SESION = "ferreteria_sesion";

// Lee el vencimiento (exp) del token, en milisegundos. No verifica la firma: eso lo hace el backend.
export function vencimientoToken(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const relleno = "=".repeat((4 - (base64.length % 4)) % 4);
    const datos = JSON.parse(atob(base64 + relleno));
    return typeof datos.exp === "number" ? datos.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function tokenVencido(token, ahora = Date.now()) {
  const vencimiento = vencimientoToken(token);
  return vencimiento === null || vencimiento <= ahora;
}

export function borrarSesion() {
  try {
    sessionStorage.removeItem(CLAVE_SESION);
  } catch {
    // Sin sessionStorage no hay nada que borrar
  }
}

export function guardarSesion(sesion) {
  try {
    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  } catch {
    // Sin sessionStorage la sesión dura solo mientras la página esté abierta
  }
}

// Devuelve { token, usuario } o null. Si el token ya venció, limpia la sesión.
export function leerSesion() {
  try {
    const texto = sessionStorage.getItem(CLAVE_SESION);
    if (!texto) return null;
    const sesion = JSON.parse(texto);
    if (!sesion || !sesion.token || !sesion.usuario || tokenVencido(sesion.token)) {
      borrarSesion();
      return null;
    }
    return sesion;
  } catch {
    return null;
  }
}

export function leerToken() {
  const sesion = leerSesion();
  return sesion ? sesion.token : null;
}
