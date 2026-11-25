import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Sin sesión lleva a /login. Con sesión pero sin el rol pedido lleva al inicio.
// rolRequerido puede ser un rol ("admin") o varios (["admin", "vendedor"]).
// El backend vuelve a revisar el rol en cada petición: esto solo ordena la interfaz.
function RutaProtegida(props) {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  const permitidos = props.rolRequerido ? [].concat(props.rolRequerido) : [];
  if (permitidos.length > 0 && !permitidos.includes(usuario.rol)) {
    return <Navigate to="/" replace />;
  }

  return props.children;
}

export default RutaProtegida;
