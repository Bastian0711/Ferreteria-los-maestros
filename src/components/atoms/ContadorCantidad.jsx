function ContadorCantidad(props) {
    const min = props.min ?? 1;
    const max = props.max ?? Infinity;
    const valor = props.value;

    return (
        <div className="input-group input-group-sm" style={{ maxWidth: "130px" }}>
            <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => props.onChange(valor - 1)}
                disabled={valor <= min}
            >
                −
            </button>
            <input
                type="text"
                className="form-control text-center"
                value={valor}
                readOnly
            />
            <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => props.onChange(valor + 1)}
                disabled={valor >= max}
            >
                +
            </button>
        </div>
    );
}

export default ContadorCantidad;