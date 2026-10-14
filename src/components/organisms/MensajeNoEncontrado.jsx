import { Container, Row, Col } from "react-bootstrap";
import Boton from "../atoms/Boton";

function MensajeNoEncontrado(props) {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} className="text-center">
          <p className="display-1 fw-bold text-secondary mb-0">{props.codigo}</p>
          <h1 className="h3 mb-3">{props.titulo}</h1>
          <p className="lead mb-4">{props.descripcion}</p>
          <Boton
            texto={props.textoBoton}
            variante="primary"
            onClick={props.onVolver}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default MensajeNoEncontrado;