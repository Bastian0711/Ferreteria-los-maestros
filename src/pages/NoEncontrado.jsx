import { useNavigate } from "react-router-dom";
import MensajeNoEncontrado from "../components/organisms/MensajeNoEncontrado";
import { useTituloPagina } from "../hooks/useTituloPagina";
import PlantillaPublica from "../components/templates/PlantillaPublica";

function NoEncontrado() {
  useTituloPagina("Página no encontrada");
  const navigate = useNavigate();

  return (
    <PlantillaPublica>
      <div className="py-5">
        <MensajeNoEncontrado
          codigo="404"
          titulo="Página no encontrada"
          descripcion="La página que buscas no existe o fue movida. Revisa la dirección o vuelve al inicio."
          textoBoton="Volver al inicio"
          onVolver={() => navigate("/")}
        />
      </div>
    </PlantillaPublica>
  );
}

export default NoEncontrado;