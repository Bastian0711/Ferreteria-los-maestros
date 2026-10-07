import { useState } from "react";
import { Form } from "react-bootstrap";
import CampoFormulario from "../molecules/CampoFormulario";
import Boton from "../atoms/Boton";

function FormularioContacto(props) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState({});

  function manejarSubmit(e) {
    e.preventDefault();

    const nuevosErrores = {};
    if (!nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    }
    if (!correo.trim()) {
      nuevosErrores.correo = "El correo es obligatorio.";
    }
    if (!mensaje.trim()) {
      nuevosErrores.mensaje = "El mensaje es obligatorio.";
    }
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      props.onEnviar({ nombre, correo, mensaje });
      setNombre("");
      setCorreo("");
      setMensaje("");
    }
  }

  return (
    <Form onSubmit={manejarSubmit} noValidate className="p-4 shadow-sm rounded bg-white">
      <h2 className="mb-4">Escríbenos</h2>

      <CampoFormulario
        id="nombre"
        label="Nombre"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        error={errores.nombre}
      />
      <CampoFormulario
        id="correo-contacto"
        label="Correo electrónico"
        type="email"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        error={errores.correo}
      />

      <div className="mb-3">
        <label htmlFor="mensaje" className="form-label">Mensaje</label>
        <textarea
          id="mensaje"
          className="form-control"
          rows={4}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
        />
        {errores.mensaje && (
          <div className="text-danger small mt-1">{errores.mensaje}</div>
        )}
      </div>

      <div className="d-grid">
        <Boton texto="Enviar mensaje" type="submit" variante="primary" />
      </div>
    </Form>
  );
}

export default FormularioContacto;