import EtiquetaStock from "../atoms/EtiquetaStock";


function PanelStockCritico(props) {
    const productos = props.productos || [];

    if (productos.length === 0) {
        return <p className="text-muted mb-0">No hay productos con stock crítico.</p>;
    }

    return (
        <div className="table-responsive">
            <table className="table table-sm align-middle mb-0">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Producto</th>
                        <th>Stock</th>
                        <th className="text-end">Mínimo</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto) => (
                        <tr key={producto.codigo}>
                            <td>{producto.codigo}</td>
                            <td>{producto.nombre}</td>
                            <td>
                                <EtiquetaStock stock={producto.stock} umbral={producto.stockMinimo} />
                            </td>
                            <td className="text-end">{producto.stockMinimo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PanelStockCritico;
