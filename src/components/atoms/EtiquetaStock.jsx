function EtiquetaStock(props) {
    const stock = props.stock;
    const umbral = props.umbral ?? 10;
    const stockBajo = stock > 0 && stock <= umbral;

    let clase = "bg-success";
    let texto = `Stock: ${stock}`;

    if (stock <= 0) {
        clase = "bg-danger";
        texto = "Sin stock";
    } else if (stockBajo) {
        clase = "bg-warning text-dark";
        texto = stock === 1
            ? "¡Solo queda 1 producto!"
            : `¡Solo quedan ${stock} productos!`;
    }

    return (
        <span className={`badge ${clase}`} role={stockBajo ? "alert" : undefined}>
            {texto}
        </span>
    );
}

export default EtiquetaStock;