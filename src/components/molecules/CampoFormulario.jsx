import CampoTexto from "../atoms/CampoTexto";

function CampoFormulario(props) {
    return (
        <div className="mb-3">
            <label htmlFor={props.id} className="form-label">
                {props.label}
            </label>
            <CampoTexto
                id={props.id}
                type={props.type}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
                required={props.required}
            />
            {props.error && (
                <div className="text-danger small mt-1">{props.error}</div>
            )}
        </div>
    )
}

export default CampoFormulario;