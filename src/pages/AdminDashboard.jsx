import { Row, Col } from "react-bootstrap";
import PlantillaAdmin from "../components/templates/PlantillaAdmin";
import TarjetaEstadistica from "../components/molecules/TarjetaEstadistica";
import PanelStockCritico from "../components/organisms/PanelStockCritico";
import UltimosPedidos from "../components/organisms/UltimosPedidos";
import Precio from "../components/atoms/Precio";
import { useTituloPagina } from "../hooks/useTituloPagina";
import { useCatalogo } from "../context/CatalogoContext";
import { listarPedidos, ESTADOS_PEDIDO } from "../services/pedidosService";

// Resumen del negocio: números clave, productos por reponer y últimos pedidos.
function AdminDashboard() {
  useTituloPagina("Resumen");
  const { productos } = useCatalogo();
  const pedidos = listarPedidos();

  const criticos = productos.filter((p) => p.stock <= p.stockMinimo);
  const pendientes = pedidos.filter((p) => p.estado === ESTADOS_PEDIDO[0]);
  const ventas = pedidos.reduce((suma, pedido) => suma + pedido.total, 0);
  const ultimos = [...pedidos].reverse().slice(0, 5);

  return (
    <PlantillaAdmin>
      <h1 className="h3 mb-4">Resumen</h1>

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
          <UltimosPedidos pedidos={ultimos} />
        </Col>
      </Row>
    </PlantillaAdmin>
  );
}

export default AdminDashboard;
