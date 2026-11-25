import { useState } from "react";
import { Alert, Container, Row, Col } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import PlantillaPublica from "../components/templates/PlantillaPublica";
import FormularioCheckout from "../components/organisms/FormularioCheckout";
import ResumenTotales from "../components/molecules/ResumenTotales";
import { useTituloPagina } from "../hooks/useTituloPagina";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import { useCatalogo } from "../context/CatalogoContext";
import { crearPedido } from "../services/pedidosService";

const ROLES_QUE_COMPRAN = ["cliente", "contratista"];

function Checkout() {
  useTituloPagina("Confirmar solicitud");
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { items, total, cantidadTotal, limpiar } = useCarrito();
  const { cargando, recargar } = useCatalogo();

  const [confirmada, setConfirmada] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // El pedido queda a nombre del usuario del token: hay que iniciar sesión para confirmar
  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: "/checkout" }} />;
  }

  if (cargando) {
    return (
      <PlantillaPublica>
        <p className="text-center text-muted py-5">Cargando tu solicitud...</p>
      </PlantillaPublica>
    );
  }

  if (items.length === 0 && !confirmada) {
    return <Navigate to="/carrito" replace />;
  }

  const puedeComprar = ROLES_QUE_COMPRAN.includes(usuario.rol);

  async function manejarConfirmar(datos) {
    setEnviando(true);
    try {
      const pedido = await crearPedido({
        items: items.map((item) => ({ codigo: item.codigo, cantidad: item.cantidad })),
        entrega: datos.entrega,
      });

      setConfirmada(true);
      limpiar();
      recargar(); // el stock cambió en el servidor
      navigate(`/pedido/${pedido.numero}`);
    } catch (error) {
      // Por ejemplo, 409: otro cliente compró antes y ya no alcanza el stock.
      // El carrito se conserva para poder ajustar y reintentar.
      recargar();
      navigate("/pedido/error", { state: { motivo: error.message } });
    } finally {
      setEnviando(false);
    }
  }

  const datosIniciales = {
    nombre: usuario.nombre,
    apellidos: usuario.apellidos,
    correo: usuario.correo,
    direccion: usuario.direccion,
  };

  return (
    <PlantillaPublica>
      <Container className="py-4">
        <h1 className="mb-4">Confirmar solicitud</h1>

        <Row className="g-4">
          <Col xs={12} lg={7}>
            {puedeComprar ? (
              <FormularioCheckout
                datosIniciales={datosIniciales}
                cuentaCorriente={Boolean(usuario.cuentaCorriente)}
                enviando={enviando}
                onConfirmar={manejarConfirmar}
              />
            ) : (
              <Alert variant="warning">
                Las cuentas de administración y venta no hacen solicitudes. Inicia sesión como cliente.
              </Alert>
            )}
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
