import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormularioLogin from "../components/organisms/FormularioLogin";
import { useTituloPagina } from "../hooks/useTituloPagina";
import { useAuth } from "../context/AuthContext";
import PlantillaPublica from "../components/templates/PlantillaPublica";

function Login() {
  useTituloPagina("Iniciar sesión");
  const navigate = useNavigate();
  const { iniciarSesion } = useAuth();
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function manejarLogin(datos) {
    setError("");
    setCargando(true);
    try {
      const usuario = await iniciarSesion(datos.correo, datos.contrasena);
      if (!usuario) {
        setError("Correo o contraseña incorrectos.");
        return;
      }
      navigate(usuario.rol === "admin" ? "/admin/productos" : "/catalogo");
    } catch (e) {
      // Sin conexión con el servidor u otro error del backend
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <PlantillaPublica>
      <div className="py-5">
        <FormularioLogin onLogin={manejarLogin} error={error} cargando={cargando} />
      </div>
    </PlantillaPublica>
  );
}

export default Login;
