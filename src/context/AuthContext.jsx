import { createContext, useContext, useState } from "react";
import { autenticar, registrarUsuario } from "../services/authService";

const CLAVE_SESION = "ferreteria_sesion";

const AuthContext = createContext({
  usuario: null,
  esAdmin: false,
  iniciarSesion: () => null,
  registrar: () => null,
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
    // Sin localStorage la sesion dura solo mientras la pestaña este abierta
  }
}

export function AuthProvider(props) {
  const [usuario, setUsuario] = useState(leerSesion);

  // Devuelve el usuario si las credenciales son correctas, o null si no
  function iniciarSesion(correo, contrasena) {
    const encontrado = autenticar(correo, contrasena);
    if (!encontrado) return null;

    setUsuario(encontrado);
    guardarSesion(encontrado);
    return encontrado;
  }

  function registrar(datos) {
    const nuevo = registrarUsuario(datos);
    setUsuario(nuevo);
    guardarSesion(nuevo);
    return nuevo;
  }

  function cerrarSesion() {
    setUsuario(null);
    guardarSesion(null);
  }

  const valor = {
    usuario,
    esAdmin: usuario?.rol === "admin",
    iniciarSesion,
    registrar,
    cerrarSesion,
  };

  return <AuthContext.Provider value={valor}>{props.children}</AuthContext.Provider>;
}

// eslint-disable-next-line react/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}