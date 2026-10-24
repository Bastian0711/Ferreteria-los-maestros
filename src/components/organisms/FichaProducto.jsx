import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import Precio from "../atoms/Precio";
import EtiquetaStock from "../atoms/EtiquetaStock";
import ContadorCantidad from "../atoms/ContadorCantidad";
import Boton from "../atoms/Boton";
import ImagenProducto from "../atoms/ImagenProducto";
import { estaEnOferta, precioFinal } from "../../utils/precios";


function FichaProducto(props) {
    const producto = props.producto;
    const sinStock = producto.stock <= 0;
    const enOferta = estaEnOferta(producto);

    const [cantidad, setCantidad] = useState(1);
    const cantidadSegura = Math.min(cantidad, Math.max(producto.stock, 1));

    return (
        <Row className="g-4">
            <Col xs={12} md={5}>
                <ImagenProducto src={producto.imagen} alt={producto.nombre} className="img-fluid rounded" />
            </Col>

            <Col xs={12} md={7}>
                <h1 className="h2">{producto.nombre}</h1>

                <p className="mb-2">
                    <span className="badge bg-secondary me-1">{producto.marca}</span>
                    {props.categoriaNombre && (
                        <span className="badge bg-info text-dark me-1">{props.categoriaNombre}</span>
                    )}
                    {producto.subcategoria && (
                        <span className="badge bg-light text-dark border">{producto.subcategoria}</span>
                    )}
                </p>

                <div className="mb-2">
                    {enOferta && (
                        <span className="d-block text-muted text-decoration-line-through">
                            <Precio valor={producto.precioVenta} className="small" />
                        </span>
                    )}
                    <Precio valor={precioFinal(producto)} className="fw-bold fs-3" />
                    {enOferta && <span className="badge bg-danger ms-2">Oferta</span>}
                </div>

                <p className="mb-2">
                    <EtiquetaStock stock={producto.stock} umbral={producto.stockMinimo} />
                </p>
                <p className="text-muted">Se vende por: {producto.unidad}</p>

                <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                    <ContadorCantidad
                        value={cantidadSegura}
                        min={1}
                        max={producto.stock}
                        onChange={setCantidad}
                    />
                    <Boton
                        texto="Agregar a la solicitud"
                        disabled={sinStock}
                        onClick={() => props.onAgregar(cantidadSegura)}
                    />
                </div>

                <Boton
                    texto="Volver al catálogo"
                    variante="outline-secondary"
                    onClick={props.onVolver}
                />
            </Col>
        </Row>
    );
}

export default FichaProducto;
