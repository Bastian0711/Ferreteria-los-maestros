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
  const [cargando, setCargando] = useState(false);

  async function manejarRegistro(datos) {
    setError("");
    setCargando(true);
    try {
      await registrar(datos); // crea la cuenta en el backend y deja la sesión iniciada
      navigate("/catalogo");
    } catch (e) {
      // Por ejemplo, el correo ya está registrado (409) o los datos no son válidos (400)
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <PlantillaPublica>
      <div className="py-5">
        <FormularioRegistro onRegistrar={manejarRegistro} error={error} cargando={cargando} />
      </div>
    </PlantillaPublica>
  );
}

export default Registro;
