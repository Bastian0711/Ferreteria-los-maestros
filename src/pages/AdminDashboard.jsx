import { useCallback, useEffect, useState } from "react";
import { Alert, Row, Col } from "react-bootstrap";
import PlantillaAdmin from "../components/templates/PlantillaAdmin";
import TarjetaEstadistica from "../components/molecules/TarjetaEstadistica";
import PanelStockCritico from "../components/organisms/PanelStockCritico";
import UltimosPedidos from "../components/organisms/UltimosPedidos";
import Precio from "../components/atoms/Precio";
import { useTituloPagina } from "../hooks/useTituloPagina";
import { useCatalogo } from "../context/CatalogoContext";
import {
  listarPedidos,
  cambiarEstadoPedido,
  siguienteEstado,
  ESTADOS_PEDIDO,
  ESTADO_ANULADO,
} from "../services/pedidosService";

// Resumen del negocio: números clave, productos por reponer y últimos pedidos (desde ms-catalogo).
function AdminDashboard() {
  useTituloPagina("Resumen");
  const { productos } = useCatalogo();
  const [pedidos, setPedidos] = useState([]);
  const [aviso, setAviso] = useState(null);

  const cargarPedidos = useCallback(async () => {
    try {
      setPedidos(await listarPedidos());
    } catch (error) {
      setAviso({ variante: "danger", mensaje: error.message });
    }
  }, []);

  useEffect(() => {
    cargarPedidos();
  }, [cargarPedidos]);

  // Avanza un paso: Pendiente → En preparación → Listo → Entregado (el backend rechaza saltos con 409)
  async function avanzar(pedido) {
    const nuevo = siguienteEstado(pedido.estado);
    if (!nuevo) return;
    try {
      await cambiarEstadoPedido(pedido.numero, nuevo);
      setAviso({ variante: "success", mensaje: `${pedido.numero} pasó a "${nuevo}".` });
      cargarPedidos();
    } catch (error) {
      setAviso({ variante: "danger", mensaje: error.message });
    }
  }

  const criticos = productos.filter((p) => p.stock <= p.stockMinimo);
  const pendientes = pedidos.filter((p) => p.estado === ESTADOS_PEDIDO[0]);
  const ventas = pedidos
    .filter((p) => p.estado !== ESTADO_ANULADO)
    .reduce((suma, pedido) => suma + pedido.total, 0);
  const ultimos = pedidos.slice(0, 5); // la API los entrega del más reciente al más antiguo

  return (
    <PlantillaAdmin>
      <h1 className="h3 mb-4">Resumen</h1>

      {aviso && (
        <Alert variant={aviso.variante} dismissible onClose={() => setAviso(null)}>
          {aviso.mensaje}
        </Alert>
      )}

      <Row className="g-3 mb-4">
        <Col xs={12} sm={6} xl={3}>
          <TarjetaEstadistica titulo="Total de productos" valor={productos.length} />
        </Col>
        <Col xs={12} sm={6} xl={3}>
          <TarjetaEstadistica
            titulo="Stock crítico"
            valor={criticos.length}
            detalle="Productos en o bajo su stock mínimo"
            variante="danger"
          />
        </Col>
        <Col xs={12} sm={6} xl={3}>
          <TarjetaEstadistica
            titulo="Pedidos pendientes"
            valor={pendientes.length}
            variante="warning"
          />
        </Col>
        <Col xs={12} sm={6} xl={3}>
          <TarjetaEstadistica
            titulo="Ventas registradas"
            valor={<Precio valor={ventas} className="" />}
            variante="success"
          />
        </Col>
      </Row>

      <Row className="g-4">
        <Col xs={12} xl={6}>
          <h2 className="h5">Productos con stock crítico</h2>
          <PanelStockCritico productos={criticos} />
        </Col>
        <Col xs={12} xl={6}>
          <h2 className="h5">Últimos pedidos</h2>
          <UltimosPedidos pedidos={ultimos} onAvanzar={avanzar} />
        </Col>
      </Row>
    </PlantillaAdmin>
  );
}

export default AdminDashboard;
