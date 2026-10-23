import GrillaProductos from "./GrillaProductos";
import Boton from "../atoms/Boton";


function SeccionProductos(props) {
    const productos = props.productos || [];

    if (productos.length === 0) return null;

    return (
        <section className="py-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <h2 className="h3 mb-0">{props.titulo}</h2>
                {props.onVerTodos && (
                    <Boton
                        texto={props.textoVerTodos || "Ver todo el catálogo"}
                        variante="outline-primary"
                        onClick={props.onVerTodos}
                    />
                )}
            </div>
            <GrillaProductos
                productos={productos}
                onAgregar={props.onAgregar}
                onVerDetalle={props.onVerDetalle}
            />
        </section>
    );
}

export default SeccionProductos;
