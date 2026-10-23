import { useState } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import FormularioContacto from "../components/organisms/FormularioContacto";
import { useTituloPagina } from "../hooks/useTituloPagina";
import PlantillaPublica from "../components/templates/PlantillaPublica";

function Contacto() {
  useTituloPagina("Contáctanos");
  const [nombreEnviado, setNombreEnviado] = useState("");

  // Es una simulacion, no hay servicor para guardar dicha informacion de contacto
  function manejarEnvio(datos) {
    setNombreEnviado(datos.nombre);
  }

  return (
    <PlantillaPublica>
      <Container className="py-5">
        <Row className="g-4">
          <Col xs={12} md={5}>
            <h1 className="mb-3">Contáctanos</h1>
            <p>
              ¿Necesitas consultar por un producto o una cotización?
              Escríbenos y te respondemos a la brevedad.
            </p>
            <p className="mb-1"><strong>Ubicación:</strong> La Serena, Región de Coquimbo</p>
          </Col>
          <Col xs={12} md={7}>
            {nombreEnviado && (
              <Alert variant="success" dismissible onClose={() => setNombreEnviado("")}>
                Gracias, {nombreEnviado}. Recibimos tu mensaje.
              </Alert>
            )}
            <FormularioContacto onEnviar={manejarEnvio} />
          </Col>
        </Row>
      </Container>
    </PlantillaPublica>
  );
}

export default Contacto;
