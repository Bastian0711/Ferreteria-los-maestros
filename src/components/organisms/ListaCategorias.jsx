import { Row, Col } from "react-bootstrap";
import Boton from "../atoms/Boton";


function ListaCategorias(props) {
    const categorias = props.categorias || [];

    return (
        <Row className="g-2">
            {categorias.map((categoria) => (
                <Col key={categoria.id} xs={12} sm={6} lg={4}>
                    <div className="d-grid">
                        <Boton
                            texto={categoria.nombre}
                            variante="outline-primary"
                            onClick={() => props.onElegir(categoria.id)}
                        />
                    </div>
                </Col>
            ))}
        </Row>
    );
}

export default ListaCategorias;
