import CampoTexto from "../atoms/CampoTexto";

function BuscadorProductos(props) {
    const id = props.id || "buscador-productos";

    return (
        <div className="mb-3">
            <label htmlFor={id} className="form-label">
                {props.label || "Buscar"}
            </label>
            <CampoTexto
                id={id}
                placeholder={props.placeholder || "Nombre o marca del producto"}
                value={props.value}
                onChange={props.onChange}
            />
        </div>
    );
}

export default BuscadorProductos;
