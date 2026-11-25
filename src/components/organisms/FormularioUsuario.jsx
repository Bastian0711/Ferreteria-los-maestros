import { useState } from "react";
import { Form, Alert, Row, Col } from "react-bootstrap";
import CampoFormulario from "../molecules/CampoFormulario";
import CampoSelector from "../molecules/CampoSelector";
import CampoCasilla from "../molecules/CampoCasilla";
import Boton from "../atoms/Boton";
import { esCorreoValido, validarContrasena } from "../../utils/validaciones";

// Formulario para crear (con correo y contraseña) o editar (con rol y estado) un usuario.
function FormularioUsuario(props) {
  const inicial = props.usuarioInicial;
  const esEdicion = Boolean(inicial);

  const [nombre, setNombre] = useState(inicial ? inicial.nombre : "");
  const [apellidos, setApellidos] = useState(inicial ? inicial.apellidos : "");
  const [correo, setCorreo] = useState(inicial ? inicial.correo : "");
  const [contrasena, setContrasena] = useState("");
  const [direccion, setDireccion] = useState(inicial && inicial.direccion ? inicial.direccion : "");
  const [rol, setRol] = useState(inicial ? inicial.rol : "cliente");
  const [activo, setActivo] = useState(inicial ? inicial.activo : true);
  const [errores, setErrores] = useState({});

  const opcionesRol = (props.roles || []).map((r) => ({ value: r.nombre, label: r.nombre }));

  function manejarSubmit(e) {
    e.preventDefault();

    const nuevosErrores = {};
    if (!nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
    if (!apellidos.trim()) nuevosErrores.apellidos = "Los apellidos son obligatorios.";
    if (!esEdicion) {
      if (!esCorreoValido(correo)) nuevosErrores.correo = "Ingresa un correo válido.";
      const errorClave = validarContrasena(contrasena);
      if (errorClave) nuevosErrores.contrasena = errorClave;
    }
    if (!rol) nuevosErrores.rol = "Selecciona un rol.";
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      props.onGuardar({
        nombre: nombre.trim(),
        apellidos: apellidos.trim(),
        correo: correo.trim(),
        contrasena,
        direccion: direccion.trim(),
        rol,
        activo,
      });
    }
  }

  return (
    <Form onSubmit={manejarSubmit} noValidate>
      {props.error && <Alert variant="danger">{props.error}</Alert>}

      <Row>
        <Col xs={12} md={6}>
          <CampoFormulario
            id="usuario-nombre"
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            error={errores.nombre}
          />
        </Col>
        <Col xs={12} md={6}>
          <CampoFormulario
            id="usuario-apellidos"
            label="Apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            error={errores.apellidos}
          />
        </Col>
      </Row>

      {esEdicion ? (
        <p className="mb-3">
          <strong>Correo:</strong> {correo}
        </p>
      ) : (
        <Row>
          <Col xs={12} md={6}>
            <CampoFormulario
              id="usuario-correo"
              label="Correo electrónico"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              error={errores.correo}
            />
          </Col>
          <Col xs={12} md={6}>
            <CampoFormulario
              id="usuario-contrasena"
              label="Contraseña"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              error={errores.contrasena}
            />
          </Col>
        </Row>
      )}

      <CampoFormulario
        id="usuario-direccion"
        label="Dirección (opcional)"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
      />

      <CampoSelector
        id="usuario-rol"
        label="Rol"
        opciones={opcionesRol}
        value={rol}
        onChange={(e) => setRol(e.target.value)}
        error={errores.rol}
      />

      {esEdicion && (
        <CampoCasilla
          id="usuario-activo"
          label="Cuenta activa"
          checked={activo}
          onChange={(e) => setActivo(e.target.checked)}
        />
      )}

      <div className="d-flex gap-2 justify-content-end">
        <Boton texto="Cancelar" variante="outline-secondary" onClick={props.onCancelar} />
        <Boton
          texto={props.guardando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Crear usuario"}
          type="submit"
          disabled={props.guardando}
        />
      </div>
    </Form>
  );
}

export default FormularioUsuario;
