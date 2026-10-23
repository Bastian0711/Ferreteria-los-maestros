import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormularioRegistro from "../components/organisms/FormularioRegistro";
import PlantillaPublica from "../components/templates/PlantillaPublica";
import { useTituloPagina } from "../hooks/useTituloPagina";
import { useAuth } from "../context/AuthContext";

function Registro() {
  useTituloPagina("Crear cuenta");
  const navigate = useNavigate();
  const { registrar } = useAuth();
  const [error, setError] = useState("");

  function manejarRegistro(datos) {
    try {
      registrar(datos); // crea la cuenta y deja la sesión iniciada
      setError("");
      navigate("/catalogo");
    } catch (e) {
      // por ejemplo el correo ya está registrado.
      setError(e.message);
    }
  }

  return (
    <PlantillaPublica>
      <div className="py-5">
        <FormularioRegistro onRegistrar={manejarRegistro} error={error} />
      </div>
    </PlantillaPublica>
  );
}

export default Registro;
