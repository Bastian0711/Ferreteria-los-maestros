function Precio(props) {
    const formato = new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
    });

    return (
        <span className={props.className || "fw-bold fs-5"}>
            {formato.format(props.valor)}
        </span>
    );
}

export default Precio;