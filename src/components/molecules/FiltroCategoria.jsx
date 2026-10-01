import Selector from "../atoms/Selector";

function FiltroCategoria(props) {
    const opciones = (props.categorias || []).map((c) => ({ value: c, label: c }));

    return (
        <div className="mb-3">
            <label htmlFor={props.id || "filtro-categoria"} className="form-label">
                {props.label || "Categoría"}
            </label>
            <Selector
                id={props.id || "filtro-categoria"}
                placeholder="Todas las categorías"
                opciones={opciones}
                value={props.value}
                onChange={props.onChange}
            />
        </div>
    );
}

export default FiltroCategoria;
