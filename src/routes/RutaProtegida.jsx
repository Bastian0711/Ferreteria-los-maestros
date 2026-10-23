import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Sin sesión lleva a /login. Con sesión pero rol distinto lleva al inicio.
function RutaProtegida(props) {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (props.rolRequerido && usuario.rol !== props.rolRequerido) {
    return <Navigate to="/" replace />;
  }

  return props.children;
}

export default RutaProtegida;
