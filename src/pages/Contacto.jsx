import { Container, Row, Col } from "react-bootstrap";
import FormularioContacto from "../components/organisms/FormularioContacto";

function Contacto() {
  function manejarEnvio(datos) {
    console.log("Mensaje de contacto:", datos);
    alert(`Gracias, ${datos.nombre}. Recibimos tu mensaje.`);
  }

  return (
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
          <FormularioContacto onEnviar={manejarEnvio} />
        </Col>
      </Row>
    </Container>
  );
}

export default Contacto;