import Precio from "../atoms/Precio";
import EtiquetaEstado from "../atoms/EtiquetaEstado";


function UltimosPedidos(props) {
    const pedidos = props.pedidos || [];

    if (pedidos.length === 0) {
        return <p className="text-muted mb-0">Aún no hay pedidos.</p>;
    }

    return (
        <div className="table-responsive">
            <table className="table table-sm align-middle mb-0">
                <thead>
                    <tr>
                        <th>N°</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Pago</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map((pedido) => (
                        <tr key={pedido.numero}>
                            <td>{pedido.numero}</td>
                            <td>{new Date(pedido.fecha).toLocaleDateString("es-CL")}</td>
                            <td>
                                <Precio valor={pedido.total} className="fw-semibold" />
                            </td>
                            <td>
                                <EtiquetaEstado estado={pedido.estado} />
                            </td>
                            <td>{pedido.pago}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UltimosPedidos;
