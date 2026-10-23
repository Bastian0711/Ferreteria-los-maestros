import { useState } from "react";
import { Form, Alert, Row, Col } from "react-bootstrap";
import CampoFormulario from "../molecules/CampoFormulario";
import CampoSelector from "../molecules/CampoSelector";
import Boton from "../atoms/Boton";
import { esCorreoValido } from "../../utils/validaciones";

const OPCIONES_ENTREGA = [
  { value: "retiro", label: "Retiro en tienda" },
  { value: "despacho", label: "Despacho a domicilio" },
];

// Formulario para confirmar la solicitud. Recibe los datos de la sesión si es que hay
function FormularioCheckout(props) {
  const inicial = props.datosIniciales || {};

  const [nombre, setNombre] = useState(inicial.nombre || "");
  const [apellidos, setApellidos] = useState(inicial.apellidos || "");
  const [correo, setCorreo] = useState(inicial.correo || "");
  const [tipoEntrega, setTipoEntrega] = useState("retiro");
  const [direccion, setDireccion] = useState(inicial.direccion || "");
  const [errores, setErrores] = useState({});

  const esDespacho = tipoEntrega === "despacho";

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
    if (esDespacho && !direccion.trim()) {
      nuevosErrores.direccion = "La dirección es obligatoria para el despacho.";
    }
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      props.onConfirmar({
        nombre: nombre.trim(),
        apellidos: apellidos.trim(),
        correo: correo.trim(),
        entrega: { tipo: tipoEntrega, direccion: esDespacho ? direccion.trim() : "" },
      });
    }
  }

  return (
    <Form onSubmit={manejarSubmit} noValidate className="p-4 shadow-sm rounded bg-white">
      <h2 className="h4 mb-3">Tus datos</h2>

      {props.cuentaCorriente && (
        <Alert variant="info">
          Tu cuenta corriente está activa: esta solicitud quedará como pago pendiente a fin de mes.
        </Alert>
      )}

      <Row>
        <Col xs={12} md={6}>
          <CampoFormulario
            id="checkout-nombre"
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            error={errores.nombre}
          />
        </Col>
        <Col xs={12} md={6}>
          <CampoFormulario
            id="checkout-apellidos"
            label="Apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            error={errores.apellidos}
          />
        </Col>
      </Row>

      <CampoFormulario
        id="checkout-correo"
        label="Correo electrónico"
        type="email"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        error={errores.correo}
      />

      <CampoSelector
        id="checkout-entrega"
        label="Tipo de entrega"
        opciones={OPCIONES_ENTREGA}
        value={tipoEntrega}
        onChange={(e) => setTipoEntrega(e.target.value)}
      />

      {esDespacho && (
        <CampoFormulario
          id="checkout-direccion"
          label="Dirección de despacho"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          error={errores.direccion}
        />
      )}

      <div className="d-grid">
        <Boton texto="Confirmar solicitud" type="submit" />
      </div>
    </Form>
  );
}

export default FormularioCheckout;
