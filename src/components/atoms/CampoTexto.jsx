function CampoTexto(props) {
    return (
        <input 
        type={props.type || "text"}
        id={props.id}
        className="form-control"
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        required={props.required || false}
        />
    );
}

export default CampoTexto;