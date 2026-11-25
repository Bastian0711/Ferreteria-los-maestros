import { apiUsuarios, mensajeDeError } from "./api";

// CRUD de usuarios contra ms-usuarios. Todas estas rutas exigen el token de un administrador
// (salvo ver o editar la propia cuenta); el backend responde 401 o 403 si no corresponde.

async function pedir(promesa, porDefecto) {
  try {
    const { data } = await promesa;
    return data;
  } catch (error) {
    throw new Error(mensajeDeError(error, porDefecto));
  }
}

// GET /usuarios (solo admin)
export function listarUsuarios() {
  return pedir(apiUsuarios.get("/usuarios"), "No pudimos cargar los usuarios.");
}

// GET /roles (solo admin)
export function listarRoles() {
  return pedir(apiUsuarios.get("/roles"), "No pudimos cargar los roles.");
}

// POST /usuarios: el admin crea una cuenta y elige su rol (por ejemplo, un vendedor)
export function crearUsuario(datos) {
  return pedir(
    apiUsuarios.post("/usuarios", {
      nombre: datos.nombre,
      apellidos: datos.apellidos,
      correo: datos.correo,
      password: datos.contrasena,
      direccion: datos.direccion || "",
      rol: datos.rol,
    }),
    "No pudimos crear el usuario."
  );
}

// PUT /usuarios/{id}: datos personales; rol y estado solo los cambia el admin
export function actualizarUsuario(id, datos) {
  return pedir(
    apiUsuarios.put(`/usuarios/${id}`, {
      nombre: datos.nombre,
      apellidos: datos.apellidos,
      direccion: datos.direccion || "",
      rol: datos.rol,
      activo: datos.activo,
    }),
    "No pudimos guardar los cambios."
  );
}

// DELETE /usuarios/{id}: desactiva la cuenta (ya no puede iniciar sesión; sus pedidos se conservan)
export function desactivarUsuario(id) {
  return pedir(apiUsuarios.delete(`/usuarios/${id}`), "No pudimos desactivar el usuario.");
}
