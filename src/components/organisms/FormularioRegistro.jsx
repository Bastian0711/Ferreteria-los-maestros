import { useState } from "react";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import CampoFormulario from "../molecules/CampoFormulario";
import Boton from "../atoms/Boton";
import { esCorreoValido, validarContrasena } from "../../utils/validaciones";

function FormularioRegistro(props) {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [repetir, setRepetir] = useState("");
  const [errores, setErrores] = useState({});

  function manejarSubmit(e) {
    e.preventDefault();

    const nuevosErrores = {};
    if (!nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
    if (!apellidos.trim()) nuevosErrores.apellidos = "Los apellidos son obligatorios.";
    if (!correo.trim()) {
      nuevosErrores.correo = "El correo es obligatorio.";
    } else if (!esCorreoValido(correo)) {
      nuevosErrores.correo = "Ingresa un correo válido, por ejemplo: nombre@correo.com";
    }
    if (!contrasena.trim()) {
      nuevosErrores.contrasena = "La contraseña es obligatoria.";
    } else {
      const errorContrasena = validarContrasena(contrasena);
      if (errorContrasena) nuevosErrores.contrasena = errorContrasena;
    }
    if (!nuevosErrores.contrasena && repetir !== contrasena) {
      nuevosErrores.repetir = "Las contraseñas no coinciden.";
    }
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      props.onRegistrar({
        nombre: nombre.trim(),
        apellidos: apellidos.trim(),
        correo: correo.trim(),
        direccion: direccion.trim(),
        contrasena,
      });
    }
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={9} lg={6}>
          <Form onSubmit={manejarSubmit} noValidate className="p-4 shadow-sm rounded bg-white">
            <h2 className="mb-4 text-center">Crear cuenta</h2>

            <Row>
              <Col xs={12} sm={6}>
                <CampoFormulario
                  id="registro-nombre"
                  label="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  error={errores.nombre}
                />
              </Col>
              <Col xs={12} sm={6}>
                <CampoFormulario
                  id="registro-apellidos"
                  label="Apellidos"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                  error={errores.apellidos}
                />
              </Col>
            </Row>

            <CampoFormulario
              id="registro-correo"
              label="Correo electrónico"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              error={errores.correo}
            />
            <CampoFormulario
              id="registro-direccion"
              label="Dirección (opcional)"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
            <CampoFormulario
              id="registro-contrasena"
              label="Contraseña"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              error={errores.contrasena}
            />
            <CampoFormulario
              id="registro-repetir"
              label="Repetir contraseña"
              type="password"
              value={repetir}
              onChange={(e) => setRepetir(e.target.value)}
              error={errores.repetir}
            />

            {props.error && <Alert variant="danger" role="alert">{props.error}</Alert>}

            <div className="d-grid">
              <Boton texto="Crear cuenta" type="submit" />
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default FormularioRegistro;
