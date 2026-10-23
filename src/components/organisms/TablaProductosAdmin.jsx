import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import BuscadorProductos from "../molecules/BuscadorProductos";
import CampoCasilla from "../molecules/CampoCasilla";
import FilaProductoAdmin from "../molecules/FilaProductoAdmin";
import { filtrarProductos } from "../../utils/filtros";

function TablaProductosAdmin(props) {
    const productos = props.productos || [];
    const categorias = props.categorias || [];

    const [texto, setTexto] = useState("");
    const [soloCriticos, setSoloCriticos] = useState(false);

    // Crítico = stock igual o menor al mínimo (incluye los agotados).
    const visibles = filtrarProductos(productos, { texto }).filter(
        (producto) => !soloCriticos || producto.stock <= producto.stockMinimo
    );

    function nombreCategoria(categoriaId) {
        const categoria = categorias.find((c) => c.id === categoriaId);
        return categoria ? categoria.nombre : "—";
    }

    return (
        <div>
            <Row className="g-3 align-items-end">
                <Col xs={12} md={6}>
                    <BuscadorProductos
                        id="admin-buscador"
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                    />
                </Col>
                <Col xs={12} md={6}>
                    <CampoCasilla
                        id="admin-solo-criticos"
                        label="Solo stock crítico"
                        checked={soloCriticos}
                        onChange={(e) => setSoloCriticos(e.target.checked)}
                    />
                </Col>
            </Row>

            <p className="text-muted">
                {visibles.length} {visibles.length === 1 ? "producto" : "productos"}
            </p>

            <div className="table-responsive">
                <table className="table table-hover align-middle bg-white">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th className="text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibles.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center text-muted py-4">
                                    No hay productos que mostrar.
                                </td>
                            </tr>
                        ) : (
                            visibles.map((producto) => (
                                <FilaProductoAdmin
                                    key={producto.codigo}
                                    producto={producto}
                                    categoriaNombre={nombreCategoria(producto.categoriaId)}
                                    onEditar={props.onEditar}
                                    onEliminar={props.onEliminar}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TablaProductosAdmin;
