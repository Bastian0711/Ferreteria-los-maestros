import { createContext, useContext, useEffect, useState } from "react";
import { autenticar, registrarUsuario } from "../services/authService";
import { borrarSesion, guardarSesion, leerSesion, vencimientoToken } from "../services/sesion";
import { EVENTO_SESION_EXPIRADA } from "../services/api";

const AuthContext = createContext({
  usuario: null,
  token: null,
  esAdmin: false,
  iniciarSesion: async () => null,
  registrar: async () => null,
  cerrarSesion: () => {},
});

// Mayor espera que acepta setTimeout (unos 24 días)
const ESPERA_MAXIMA = 2147483647;

export function AuthProvider(props) {
  const [sesion, setSesion] = useState(leerSesion);

  function cerrarSesion() {
    borrarSesion();
    setSesion(null);
  }

  // El cliente Axios avisa cuando el backend responde 401 con un token: se cierra la sesión
  useEffect(() => {
    function alExpirar() {
      borrarSesion();
      setSesion(null);
    }
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
  }, []);

  // Cierra la sesión en el momento exacto en que vence el token
  useEffect(() => {
    if (!sesion) return undefined;
    const vencimiento = vencimientoToken(sesion.token);
    if (vencimiento === null) return undefined;
    const espera = Math.min(Math.max(vencimiento - Date.now(), 0), ESPERA_MAXIMA);
    const temporizador = setTimeout(() => {
      borrarSesion();
      setSesion(null);
    }, espera);
    return () => clearTimeout(temporizador);
  }, [sesion]);

  // Devuelve el usuario si las credenciales son correctas, o null si no
  async function iniciarSesion(correo, contrasena) {
    const nueva = await autenticar(correo, contrasena);
    if (!nueva) return null;
    guardarSesion(nueva);
    setSesion(nueva);
    return nueva.usuario;
  }

  // Crea la cuenta en el backend y deja la sesión iniciada
  async function registrar(datos) {
    const nueva = await registrarUsuario(datos);
    guardarSesion(nueva);
    setSesion(nueva);
    return nueva.usuario;
  }

  const usuario = sesion ? sesion.usuario : null;

  const valor = {
    usuario,
    token: sesion ? sesion.token : null,
    esAdmin: Boolean(usuario && usuario.rol === "admin"),
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
