import { Row, Col } from "react-bootstrap";
import FilaItemCarrito from "../molecules/FilaItemCarrito";
import ResumenTotales from "../molecules/ResumenTotales";
import Boton from "../atoms/Boton";

function ListaCarrito(props) {
    const items = props.items || [];
    const hayProblemasDeStock = items.some((item) => item.cantidad > item.stock);

    return (
        <Row className="g-4">
            <Col xs={12} lg={8}>
                {/* Encabezado de columnas: solo se ve desde tableta (md) hacia arriba */}
                <Row className="d-none d-md-flex g-2 border-bottom pb-2 fw-bold text-muted">
                    <Col md={5}>Producto</Col>
                    <Col md={3}>Cantidad</Col>
                    <Col md={2} className="text-end">Subtotal</Col>
                    <Col md={2}></Col>
                </Row>

                {items.map((item) => (
                    <FilaItemCarrito
                        key={item.codigo}
                        item={item}
                        onCambiarCantidad={props.onCambiarCantidad}
                        onQuitar={props.onQuitar}
                    />
                ))}
            </Col>

            <Col xs={12} lg={4}>
                <ResumenTotales cantidad={props.cantidadTotal} total={props.total} />

                {hayProblemasDeStock && (
                    <p className="text-danger small mt-2" role="status">
                        Ajusta las cantidades que superan el stock para poder continuar.
                    </p>
                )}

                <div className="d-grid gap-2 mt-3">
                    <Boton
                        texto="Confirmar solicitud"
                        disabled={hayProblemasDeStock}
                        onClick={props.onConfirmar}
                    />
                    <Boton
                        texto="Limpiar solicitud"
                        variante="outline-secondary"
                        onClick={props.onLimpiar}
                    />
                </div>
            </Col>
        </Row>
    );
}

export default ListaCarrito;
