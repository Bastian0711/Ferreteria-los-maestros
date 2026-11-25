import { apiUsuarios, mensajeDeError } from "./api";
import { validarContrasena } from "../utils/validaciones.js";

// El backend no guarda "cuentaCorriente": en el caso, el contratista es quien paga a fin de mes
export function adaptarUsuario(usuario) {
  return { ...usuario, cuentaCorriente: usuario.rol === "contratista" };
}

// POST /auth/login. Devuelve { token, usuario } o null si las credenciales no son válidas (401)
export async function autenticar(correo, contrasena) {
  try {
    const { data } = await apiUsuarios.post("/auth/login", {
      correo: String(correo).trim(),
      password: contrasena,
    });
    return { token: data.accessToken, usuario: adaptarUsuario(data.usuario) };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return null;
    }
    throw new Error(mensajeDeError(error, "No pudimos iniciar sesión."));
  }
}

// POST /auth/registro y luego inicia sesión. El rol lo asigna el backend (cliente).
export async function registrarUsuario(datos) {
  if (!String(datos.nombre || "").trim()) throw new Error("El nombre es obligatorio.");
  if (!String(datos.apellidos || "").trim()) throw new Error("Los apellidos son obligatorios.");

  const errorContrasena = validarContrasena(String(datos.contrasena || ""));
  if (errorContrasena) throw new Error(errorContrasena);

  try {
    await apiUsuarios.post("/auth/registro", {
      nombre: datos.nombre.trim(),
      apellidos: datos.apellidos.trim(),
      correo: String(datos.correo).trim(),
      password: datos.contrasena,
      direccion: datos.direccion || "",
    });
  } catch (error) {
    throw new Error(mensajeDeError(error, "No pudimos crear la cuenta."));
  }

  const sesion = await autenticar(datos.correo, datos.contrasena);
  if (!sesion) {
    throw new Error("La cuenta se creó, pero no pudimos iniciar sesión. Inténtalo desde Iniciar sesión.");
  }
  return sesion;
}
