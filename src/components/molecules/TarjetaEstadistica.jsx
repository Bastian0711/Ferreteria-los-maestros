function TarjetaEstadistica(props) {
    const variante = props.variante || "primary";

    return (
        <div className={`card h-100 shadow-sm border-0 border-start border-4 border-${variante}`}>
            <div className="card-body">
                <p className="text-muted mb-1">{props.titulo}</p>
                <p className="display-6 fw-bold mb-1">{props.valor}</p>
                {props.detalle && <p className="small text-muted mb-0">{props.detalle}</p>}
            </div>
        </div>
    );
}

export default TarjetaEstadistica;
