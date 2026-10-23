function CampoCasilla(props) {
    return (
        <div className="form-check mb-3">
            <input
                type="checkbox"
                className="form-check-input"
                id={props.id}
                checked={Boolean(props.checked)}
                onChange={props.onChange}
            />
            <label className="form-check-label" htmlFor={props.id}>
                {props.label}
            </label>
        </div>
    );
}

export default CampoCasilla;
