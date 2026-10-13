import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTituloPagina } from "../hooks/useTituloPagina";
import PlantillaPublica from "../components/templates/PlantillaPublica";

function Inicio() {
  useTituloPagina("Inicio");

  return (
    <PlantillaPublica>
      <Container className="py-5 text-center">
        <h1 className="mb-3">Ferretería Los Maestros</h1>
        <p className="lead mb-4">
          Materiales de construcción, herramientas y ferretería general.
          22 años atendiendo a La Serena.
        </p>
        <Link to="/login" className="btn btn-primary">
          Iniciar sesión
        </Link>
      </Container>
    </PlantillaPublica>
  );
}

export default Inicio;