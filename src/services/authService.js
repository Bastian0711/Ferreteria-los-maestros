import { buscarUsuarioPorCorreo, crearUsuario } from "../data/baseDatos.js";
import { validarContrasena } from "../utils/validaciones.js";

function sinContrasena(usuario) {
  const publico = { ...usuario };
  delete publico.contrasena;
  return publico;
}

export function autenticar(correo, contrasena) {
  const usuario = buscarUsuarioPorCorreo(correo);

  if (!usuario || !usuario.activo || usuario.contrasena !== contrasena) {
    return null;
  }

  return sinContrasena(usuario);
}

export function registrarUsuario(datos) {
  if (!String(datos.nombre || "").trim()) throw new Error("El nombre es obligatorio.");
  if (!String(datos.apellidos || "").trim()) throw new Error("Los apellidos son obligatorios.");

  const errorContrasena = validarContrasena(String(datos.contrasena || ""));
  if (errorContrasena) throw new Error(errorContrasena);

  return crearUsuario({
    nombre: datos.nombre.trim(),
    apellidos: datos.apellidos.trim(),
    correo: datos.correo,
    contrasena: datos.contrasena,
    direccion: datos.direccion || "",
    rol: "cliente",
    cuentaCorriente: false,
  });
}
