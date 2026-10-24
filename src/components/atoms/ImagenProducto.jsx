import { useState } from "react";

function ImagenProducto(props) {
    const [srcFallido, setSrcFallido] = useState("");

    if (!props.src || srcFallido === props.src) {
        return (
            <div
                className="bg-light d-flex align-items-center justify-content-center text-muted"
                style={props.alto ? { height: `${props.alto}px` } : { minHeight: "240px" }}
            >
                Sin imagen
            </div>
        );
    }

    return (
        <img
            src={props.src}
            alt={props.alt}
            className={props.className || ""}
            style={props.alto ? { objectFit: "contain", height: `${props.alto}px`, width: "100%" } : undefined}
            onError={() => setSrcFallido(props.src)}
        />
    );
}

export default ImagenProducto;
