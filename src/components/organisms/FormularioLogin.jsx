import { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import CampoFormulario from "../molecules/CampoFormulario";
import Boton from "../atoms/Boton";
import { esCorreoValido, validarContrasena } from "../../utils/validaciones";

function FormularioLogin(props) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errores, setErrores] = useState({});

  function manejarSubmit(e) {
    e.preventDefault();

    const nuevosErrores = {};
    if (!correo.trim()) {
    nuevosErrores.correo = "El correo es obligatorio.";
    } else if (!esCorreoValido(correo)) {
    nuevosErrores.correo = "Ingresa un correo válido, por ejemplo: nombre@correo.com";
    }
    if (!contrasena.trim()) {
      nuevosErrores.contrasena = "La contraseña es obligatoria.";
    } else {
      const errorContrasena = validarContrasena(contrasena);
      if (errorContrasena) {
        nuevosErrores.contrasena = errorContrasena;
      }
    }
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      props.onLogin({ correo, contrasena });
    }
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={5}> 
          <Form onSubmit={manejarSubmit}  className="p-4 shadow-sm rounded bg-white">
            <h2 className="mb-4 text-center">Iniciar sesión</h2>

            <CampoFormulario
              id="correo"
              label="Correo electrónico"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              error={errores.correo}
            />
            <CampoFormulario
              id="contrasena"
              label="Contraseña"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              error={errores.contrasena}
            />

            <div className="d-grid">
              <Boton texto="Iniciar sesión" type="submit" variante="primary" />
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default FormularioLogin;