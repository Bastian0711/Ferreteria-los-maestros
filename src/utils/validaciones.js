export function esCorreoValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.trim());
}

export function validarContrasena(contrasena) {
  if (contrasena.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }
  if (!/[a-z]/.test(contrasena)) {
    return "La contraseña debe incluir al menos una minúscula.";
  }
  if (!/[A-Z]/.test(contrasena)) {
    return "La contraseña debe incluir al menos una mayúscula.";
  }
  if (!/\d/.test(contrasena)) {
    return "La contraseña debe incluir al menos un número.";
  }
  if (!/[^A-Za-z0-9]/.test(contrasena)) {
    return "La contraseña debe incluir al menos un símbolo especial (@, $, !, %, *, ?, &, #...).";
  }
  return "";
}