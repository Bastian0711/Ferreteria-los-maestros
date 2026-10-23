import { buscarUsuarioPorCorreo } from "../data/baseDatos.js";

// Devuelve el usuario SIN contraseña si las credenciales son correctas, o null si no.
export function autenticar(correo, contrasena) {
  const usuario = buscarUsuarioPorCorreo(correo);

  if (!usuario || !usuario.activo || usuario.contrasena !== contrasena) {
    return null;
  }

  const publico = { ...usuario };
  delete publico.contrasena;
  return publico;
}
