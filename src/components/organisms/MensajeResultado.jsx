import { Container, Row, Col } from "react-bootstrap";
import Boton from "../atoms/Boton";

function MensajeResultado(props) {
  const esExito = props.tipo === "exito";

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} className="text-center">
          <p
            className={`display-1 mb-0 ${esExito ? "text-success" : "text-danger"}`}
            aria-hidden="true"
          >
            {esExito ? "✓" : "✕"}
          </p>
          <h1 className="h3 mb-3">{props.titulo}</h1>
          <p className="lead mb-4">{props.descripcion}</p>
          <Boton texto={props.textoBoton} onClick={props.onAccion} />
        </Col>
      </Row>
    </Container>
  );
}

export default MensajeResultado;
