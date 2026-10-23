import { createContext, useContext, useState } from "react";
import { autenticar } from "../services/authService";

const CLAVE_SESION = "ferreteria_sesion";

// Valor por defecto: sin sesión. Así los componentes que usan useAuth()
// también funcionan en tests que no montan el AuthProvider.
const AuthContext = createContext({
  usuario: null,
  esAdmin: false,
  iniciarSesion: () => null,
  cerrarSesion: () => {},
});

function leerSesion() {
  try {
    const texto = localStorage.getItem(CLAVE_SESION);
    return texto ? JSON.parse(texto) : null;
  } catch {
    return null;
  }
}

function guardarSesion(usuario) {
  try {
    if (usuario) {
      localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
    } else {
      localStorage.removeItem(CLAVE_SESION);
    }
  } catch {
    // Sin localStorage la sesión dura solo mientras la pestaña esté abierta.
  }
}

export function AuthProvider(props) {
  const [usuario, setUsuario] = useState(leerSesion);

  // Devuelve el usuario si las credenciales son correctas, o null si no.
  function iniciarSesion(correo, contrasena) {
    const encontrado = autenticar(correo, contrasena);
    if (!encontrado) return null;

    setUsuario(encontrado);
    guardarSesion(encontrado);
    return encontrado;
  }

  function cerrarSesion() {
    setUsuario(null);
    guardarSesion(null);
  }

  const valor = {
    usuario,
    esAdmin: usuario?.rol === "admin",
    iniciarSesion,
    cerrarSesion,
  };

  return <AuthContext.Provider value={valor}>{props.children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
