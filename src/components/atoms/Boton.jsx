function Boton(props) {
    const variante = props.variante || "primary";
    return (
        <button
            type={props.type || "button"}
            className={`btn btn-${variante}`}
            onClick={props.onClick}
            disabled={props.disabled || false}
        >
            {props.texto}
        </button>
    );
}

export default Boton;

//prueba para probar commit desde cuenta creada.