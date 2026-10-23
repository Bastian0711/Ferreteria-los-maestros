import Precio from "../atoms/Precio";

// Cuántas unidades hay en la solicitud y cuánto suman.
function ResumenTotales(props) {
    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                    <span>Productos</span>
                    <span>{props.cantidad}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <strong>Total</strong>
                    <Precio valor={props.total} className="fw-bold fs-4" />
                </div>
            </div>
        </div>
    );
}

export default ResumenTotales;
