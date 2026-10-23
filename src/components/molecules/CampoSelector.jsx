import Selector from "../atoms/Selector";

function CampoSelector(props) {
    return (
        <div className="mb-3">
            <label htmlFor={props.id} className="form-label">
                {props.label}
            </label>
            <Selector
                id={props.id}
                placeholder={props.placeholder}
                opciones={props.opciones}
                value={props.value}
                onChange={props.onChange}
                required={props.required}
            />
            {props.error && (
                <div className="text-danger small mt-1">{props.error}</div>
            )}
        </div>
    );
}

export default CampoSelector;
