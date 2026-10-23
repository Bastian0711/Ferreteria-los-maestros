const COLORES = {
    "Pendiente": "bg-secondary",
    "En preparación": "bg-info text-dark",
    "Listo para retiro o despacho": "bg-primary",
    "Entregado": "bg-success",
};

function EtiquetaEstado(props) {
    const clase = COLORES[props.estado] || "bg-secondary";

    return <span className={`badge ${clase}`}>{props.estado}</span>;
}

export default EtiquetaEstado;
