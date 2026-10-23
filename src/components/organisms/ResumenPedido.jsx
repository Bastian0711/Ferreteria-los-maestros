import Precio from "../atoms/Precio";
import EtiquetaEstado from "../atoms/EtiquetaEstado";

// Comprobante de una solicitud: estado, datos del cliente, entrega, pago y productos.
function ResumenPedido(props) {
    const pedido = props.pedido;
    const cliente = pedido.cliente || {};
    const entrega =
        pedido.entrega.tipo === "despacho"
            ? `Despacho a domicilio: ${pedido.entrega.direccion}`
            : "Retiro en tienda";

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                    <h2 className="h5 mb-0">Resumen de la solicitud</h2>
                    <EtiquetaEstado estado={pedido.estado} />
                </div>

                <dl className="row mb-3">
                    <dt className="col-sm-3">Fecha</dt>
                    <dd className="col-sm-9">{new Date(pedido.fecha).toLocaleString("es-CL")}</dd>
                    <dt className="col-sm-3">Cliente</dt>
                    <dd className="col-sm-9">
                        {cliente.nombre} {cliente.apellidos} · {cliente.correo}
                    </dd>
                    <dt className="col-sm-3">Entrega</dt>
                    <dd className="col-sm-9">{entrega}</dd>
                    <dt className="col-sm-3">Pago</dt>
                    <dd className="col-sm-9">{pedido.pago}</dd>
                </dl>

                <div className="table-responsive">
                    <table className="table table-sm align-middle mb-0">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th className="text-end">Cant.</th>
                                <th className="text-end">Precio</th>
                                <th className="text-end">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedido.items.map((item) => (
                                <tr key={item.codigo}>
                                    <td>{item.nombre}</td>
                                    <td className="text-end">{item.cantidad}</td>
                                    <td className="text-end">
                                        <Precio valor={item.precioUnitario} className="small" />
                                    </td>
                                    <td className="text-end">
                                        <Precio valor={item.subtotal} className="small" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colSpan={3} className="text-end">Total</th>
                                <td className="text-end">
                                    <Precio valor={pedido.total} />
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ResumenPedido;
