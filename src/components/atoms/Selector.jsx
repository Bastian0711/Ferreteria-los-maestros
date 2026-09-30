function Selector(props) {
    const opciones = props.opciones || [];

    return (
        <select
            id={props.id}
            className="form-select"
            value={props.value}
            onChange={props.onChange}
            required={props.required || false}
        >
            {props.placeholder && <option value="">{props.placeholder}</option>}
            {opciones.map((op) => (
                <option key={op.value} value={op.value}>
                    {op.label}
                </option>
            ))}
        </select>
    );
}

export default Selector;