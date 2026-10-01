import Precio from "../atoms/Precio";
import EtiquetaStock from "../atoms/EtiquetaStock";
import Boton from "../atoms/Boton";

function TarjetaProducto(props) {
    const sinStock = props.stock <= 0;

    return (
        <div className="card h-100 shadow-sm">
            {props.imagen && (
                <img
                    src={props.imagen}
                    className="card-img-top"
                    alt={props.nombre}
                    style={{ objectFit: "cover", height: "160px" }}
                />
            )}
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{props.nombre}</h5>
                <div className="mb-2">
                    <EtiquetaStock stock={props.stock} />
                </div>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                    <Precio valor={props.precio} />
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
