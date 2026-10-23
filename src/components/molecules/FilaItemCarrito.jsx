import { Row, Col } from "react-bootstrap";
import Precio from "../atoms/Precio";
import ContadorCantidad from "../atoms/ContadorCantidad";
import Boton from "../atoms/Boton";

function FilaItemCarrito(props) {
    const item = props.item;
    const excedeStock = item.cantidad > item.stock;

    return (
        <div className="border-bottom py-3">
            <Row className="g-2 align-items-center">
                <Col xs={12} md={5}>
                    <p className="fw-bold mb-0">{item.nombre}</p>
                    <small className="text-muted d-block">
                        Precio unitario: <Precio valor={item.precioUnitario} className="small" /> · {item.unidad}
                    </small>
                    {excedeStock && (
                        <small className="text-danger d-block" role="alert">
                            Stock disponible: {item.stock}
                        </small>
                    )}
                </Col>
                <Col xs={6} md={3}>
                    <ContadorCantidad
                        value={item.cantidad}
                        min={1}
                        max={item.stock}
                        onChange={(cantidad) => props.onCambiarCantidad(item.codigo, cantidad)}
                    />
                </Col>
                <Col xs={6} md={2} className="text-end">
                    <Precio valor={item.subtotal} />
                </Col>
                <Col xs={12} md={2} className="text-md-end">
                    <Boton
                        texto="Quitar"
                        variante="outline-danger"
                        onClick={() => props.onQuitar(item.codigo)}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default FilaItemCarrito;
