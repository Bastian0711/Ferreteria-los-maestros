import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import PlantillaPublica from "../components/templates/PlantillaPublica";
import FormularioCheckout from "../components/organisms/FormularioCheckout";
import ResumenTotales from "../components/molecules/ResumenTotales";
import { useTituloPagina } from "../hooks/useTituloPagina";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import { crearPedido } from "../services/pedidosService";

function Checkout() {
  useTituloPagina("Confirmar solicitud");
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { items, total, cantidadTotal, limpiar } = useCarrito();

  const [confirmada, setConfirmada] = useState(false);

  if (items.length === 0 && !confirmada) {
    return <Navigate to="/carrito" replace />;
  }

  function manejarConfirmar(datos) {
    try {
      const pedido = crearPedido({
        usuario,
        items: items.map((item) => ({ codigo: item.codigo, cantidad: item.cantidad })),
        entrega: datos.entrega,
        datosCliente: { nombre: datos.nombre, apellidos: datos.apellidos, correo: datos.correo },
      });

      // Ambos cambios se aplican juntos: la pagina ya sabe que esta confirmada cuando el carrito queda vacio
      setConfirmada(true);
      limpiar();
      navigate(`/pedido/${pedido.numero}`);
    } catch (error) {
      // El carrito se conserva para poder reintentar
      navigate("/pedido/error", { state: { motivo: error.message } });
    }
  }

  // Si hay sesion, el formulario parte con sus datos
  const datosIniciales = usuario
    ? {
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        direccion: usuario.direccion,
      }
    : undefined;

  return (
    <PlantillaPublica>
      <Container className="py-4">
        <h1 className="mb-4">Confirmar solicitud</h1>

        <Row className="g-4">
          <Col xs={12} lg={7}>
            <FormularioCheckout
              datosIniciales={datosIniciales}
              cuentaCorriente={Boolean(usuario && usuario.cuentaCorriente)}
              onConfirmar={manejarConfirmar}
            />
          </Col>

          <Col xs={12} lg={5}>
            <h2 className="h5">Tu solicitud</h2>
            <ul className="list-unstyled small mb-3">
              {items.map((item) => (
                <li key={item.codigo}>
                  {item.nombre} × {item.cantidad}
                </li>
              ))}
            </ul>
            <ResumenTotales cantidad={cantidadTotal} total={total} />
          </Col>
        </Row>
      </Container>
    </PlantillaPublica>
  );
}

export default Checkout;
