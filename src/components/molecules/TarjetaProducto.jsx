import Precio from "../atoms/Precio";
import EtiquetaStock from "../atoms/EtiquetaStock";
import Boton from "../atoms/Boton";

function TarjetaProducto(props) {
    const sinStock = props.stock <= 0;

    function verDetalle(evento) {
        evento.preventDefault();
        props.onVerDetalle?.(props.id);
    }

    return (
        <div className="card h-100 shadow-sm">
            {props.oferta && (
                <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                    Oferta
                </span>
            )}
            {props.imagen && (
                <img
                    src={props.imagen}
                    className="card-img-top"
                    alt={props.nombre}
                    style={{ objectFit: "cover", height: "160px" }}
                />
            )}
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">
                    <a
                        href={`/producto/${props.id}`}
                        className="text-decoration-none text-reset"
                        onClick={verDetalle}
                    >
                        {props.nombre}
                    </a>
                </h5>
                <div className="mb-2">
                    <EtiquetaStock stock={props.stock} umbral={props.stockMinimo} />
                </div>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                    <div>
                        {props.precioOriginal && (
                            <span className="d-block text-muted text-decoration-line-through">
                                <Precio valor={props.precioOriginal} className="small" />
                            </span>
                        )}
                        <Precio valor={props.precio} />
                    </div>
                    <Boton
                        texto="Agregar"
                        disabled={sinStock}
                        onClick={() => props.onAgregar(props.id)}
                    />
                </div>
            </div>
        </div>
    );
}

export default TarjetaProducto;
