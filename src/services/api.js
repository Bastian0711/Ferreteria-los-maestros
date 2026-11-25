import axios from "axios";
import { leerToken } from "./sesion";

// Evento que avisa al AuthContext que el backend rechazó el token (401)
export const EVENTO_SESION_EXPIRADA = "ferreteria:sesion-expirada";

// Cliente Axios para un microservicio: URL base, tiempo máximo y token automático
export function crearClienteApi(baseURL) {
  const cliente = axios.create({
    baseURL,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
  });

  // Agrega "Authorization: Bearer <token>" si hay una sesión activa
  cliente.interceptors.request.use((config) => {
    const token = leerToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Si una petición con token recibe 401, la sesión venció o el token no es válido
  cliente.interceptors.response.use(
    (respuesta) => respuesta,
    (error) => {
      const conToken = Boolean(error.config && error.config.headers && error.config.headers.Authorization);
      if (error.response && error.response.status === 401 && conToken) {
        window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));
      }
      return Promise.reject(error);
    }
  );

  return cliente;
}

// ms-usuarios (puerto 8081). La URL real va en .env.local: VITE_API_USUARIOS
export const apiUsuarios = crearClienteApi(
  import.meta.env.VITE_API_USUARIOS || "http://localhost:8081/api/v1"
);

// ms-catalogo (puerto 8082): productos, categorías y pedidos. URL real en .env.local: VITE_API_CATALOGO
export const apiCatalogo = crearClienteApi(
  import.meta.env.VITE_API_CATALOGO || "http://localhost:8082/api/v1"
);

// Convierte un error de Axios en un mensaje para mostrar en pantalla
export function mensajeDeError(error, porDefecto = "Ocurrió un error. Inténtalo nuevamente.") {
  if (!error || !error.response) {
    return "No pudimos conectar con el servidor. Revisa tu conexión e inténtalo nuevamente.";
  }
  const datos = error.response.data || {};
  if (Array.isArray(datos.detalles) && datos.detalles.length > 0) {
    // El backend envía "campo: mensaje"; se muestra solo el mensaje
    return datos.detalles.map((detalle) => String(detalle).replace(/^[^:]+:\s*/, "")).join(" ");
  }
  return datos.mensaje || porDefecto;
}
