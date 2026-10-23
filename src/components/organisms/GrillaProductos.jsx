import { Row, Col } from "react-bootstrap";
import TarjetaProducto from "../molecules/TarjetaProducto";
import { estaEnOferta, precioFinal } from "../../utils/precios";

function GrillaProductos(props) {
    const productos = props.productos || [];

    if (productos.length === 0) {
        return (
            <p className="text-center text-muted py-5" role="status">
                {props.mensajeVacio || "No encontramos productos con esos filtros."}
            </p>
        );
    }

    return (
        <Row className="g-4">
            {productos.map((producto) => (
                <Col key={producto.codigo} xs={12} sm={6} lg={4}>
                    <TarjetaProducto
                        id={producto.codigo}
                        nombre={producto.nombre}
                        imagen={producto.imagen}
                        stock={producto.stock}
                        stockMinimo={producto.stockMinimo}
                        precio={precioFinal(producto)}
                        precioOriginal={estaEnOferta(producto) ? producto.precioVenta : undefined}
                        oferta={estaEnOferta(producto)}
                        onAgregar={props.onAgregar}
                        onVerDetalle={props.onVerDetalle}
                    />
                </Col>
            ))}
        </Row>
    );
}

export default GrillaProductos;
