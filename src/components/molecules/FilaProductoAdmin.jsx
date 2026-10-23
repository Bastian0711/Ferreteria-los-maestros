import Precio from "../atoms/Precio";
import EtiquetaStock from "../atoms/EtiquetaStock";
import Boton from "../atoms/Boton";
import { estaEnOferta, precioFinal } from "../../utils/precios";

function FilaProductoAdmin(props) {
    const producto = props.producto;

    return (
        <tr>
            <td>{producto.codigo}</td>
            <td>
                {producto.nombre}
                {estaEnOferta(producto) && <span className="badge bg-danger ms-2">Oferta</span>}
            </td>
            <td>{props.categoriaNombre}</td>
            <td>
                <Precio valor={precioFinal(producto)} className="fw-semibold" />
            </td>
            <td>
                <EtiquetaStock stock={producto.stock} umbral={producto.stockMinimo} />
            </td>
            <td className="text-end text-nowrap">
                <Boton
                    texto="Editar"
                    variante="outline-primary"
                    onClick={() => props.onEditar(producto.codigo)}
                />{" "}
                <Boton
                    texto="Eliminar"
                    variante="outline-danger"
                    onClick={() => props.onEliminar(producto.codigo)}
                />
            </td>
        </tr>
    );
}

export default FilaProductoAdmin;
