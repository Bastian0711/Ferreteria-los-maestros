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

  function manejarLogin(datos) {
    const usuario = iniciarSesion(datos.correo, datos.contrasena);

    if (!usuario) {
      setError("Correo o contraseña incorrectos.");
      return;
    }
    setError("");
    navigate(usuario.rol === "admin" ? "/admin/productos" : "/catalogo");
  }

  return (
    <PlantillaPublica>
      <div className="py-5">
        <FormularioLogin onLogin={manejarLogin} error={error} />
      </div>
    </PlantillaPublica>
  );
}

export default Login;
