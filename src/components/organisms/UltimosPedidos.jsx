import Precio from "../atoms/Precio";
import EtiquetaEstado from "../atoms/EtiquetaEstado";
import Boton from "../atoms/Boton";
import { siguienteEstado } from "../../utils/estadosPedido";


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
                        {(props.onAvanzar || props.onVer) && <th>Acción</th>}
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
                            {props.onVer && (
                                <td>
                                    <Boton
                                        texto="Ver"
                                        variante="outline-secondary btn-sm"
                                        onClick={() => props.onVer(pedido.numero)}
                                    />
                                </td>
                            )}
                            {props.onAvanzar && (
                                <td>
                                    {siguienteEstado(pedido.estado) && (
                                        <Boton
                                            texto={`Pasar a ${siguienteEstado(pedido.estado)}`}
                                            variante="outline-primary btn-sm"
                                            onClick={() => props.onAvanzar(pedido)}
                                        />
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UltimosPedidos;
