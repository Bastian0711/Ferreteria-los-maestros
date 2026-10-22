function InsigniaCarrito(props) {
    const cantidad = props.cantidad || 0;

    if (cantidad <= 0) return null;

    return (
        <span
            className="badge bg-warning text-dark ms-1"
            aria-label={`${cantidad} productos en el carrito`}
        >
            {cantidad}
        </span>
    );
}

export default InsigniaCarrito;