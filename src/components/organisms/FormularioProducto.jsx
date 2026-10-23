import { useState } from "react";
import { Form, Alert, Row, Col } from "react-bootstrap";
import CampoFormulario from "../molecules/CampoFormulario";
import CampoSelector from "../molecules/CampoSelector";
import CampoCasilla from "../molecules/CampoCasilla";
import Boton from "../atoms/Boton";

function esEnteroNoNegativo(texto) {
  return texto !== "" && Number.isInteger(Number(texto)) && Number(texto) >= 0;
}
function FormularioProducto(props) {
  const inicial = props.productoInicial;
  const esEdicion = Boolean(inicial);

  const [codigo, setCodigo] = useState(inicial ? inicial.codigo : "");
  const [nombre, setNombre] = useState(inicial ? inicial.nombre : "");
  const [categoriaId, setCategoriaId] = useState(inicial ? inicial.categoriaId : "");
  const [marca, setMarca] = useState(inicial ? inicial.marca : "");
  const [unidad, setUnidad] = useState(inicial ? inicial.unidad : "Unidad");
  const [precioVenta, setPrecioVenta] = useState(inicial ? String(inicial.precioVenta) : "");
  const [stock, setStock] = useState(inicial ? String(inicial.stock) : "");
  const [stockMinimo, setStockMinimo] = useState(inicial ? String(inicial.stockMinimo) : "");
  const [oferta, setOferta] = useState(inicial ? Boolean(inicial.oferta) : false);
  const [precioOferta, setPrecioOferta] = useState(
    inicial && inicial.precioOferta ? String(inicial.precioOferta) : ""
  );
  const [destacado, setDestacado] = useState(inicial ? Boolean(inicial.destacado) : false);
  const [errores, setErrores] = useState({});

  const opcionesCategoria = (props.categorias || []).map((c) => ({ value: c.id, label: c.nombre }));

  function manejarSubmit(e) {
    e.preventDefault();

    const nuevosErrores = {};
    if (!esEdicion && !codigo.trim()) nuevosErrores.codigo = "El código es obligatorio.";
    if (!nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
    if (!categoriaId) nuevosErrores.categoriaId = "Selecciona una categoría.";
    if (precioVenta === "" || !(Number(precioVenta) > 0)) {
      nuevosErrores.precioVenta = "Ingresa un precio de venta mayor que 0.";
    }
    if (!esEnteroNoNegativo(stock)) {
      nuevosErrores.stock = "El stock debe ser un número entero de 0 o más.";
    }
    if (!esEnteroNoNegativo(stockMinimo)) {
      nuevosErrores.stockMinimo = "El stock mínimo debe ser un número entero de 0 o más.";
    }
    if (oferta && !(Number(precioOferta) > 0 && Number(precioOferta) < Number(precioVenta))) {
      nuevosErrores.precioOferta =
        "El precio de oferta debe ser mayor que 0 y menor que el precio de venta.";
    }
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      props.onGuardar({
        codigo: codigo.trim(),
        nombre: nombre.trim(),
        categoriaId,
        marca: marca.trim(),
        unidad: unidad.trim() || "Unidad",
        precioVenta: Number(precioVenta),
        stock: Number(stock),
        stockMinimo: Number(stockMinimo),
        oferta,
        precioOferta: oferta ? Number(precioOferta) : null,
        destacado,
      });
    }
  }

  return (
    <Form onSubmit={manejarSubmit} noValidate>
      {props.error && <Alert variant="danger">{props.error}</Alert>}

      <Row>
        <Col xs={12} md={4}>
          {esEdicion ? (
            <div className="mb-3">
              <span className="form-label d-block">Código</span>
              <strong>{codigo}</strong>
            </div>
          ) : (
            <CampoFormulario
              id="producto-codigo"
              label="Código"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              error={errores.codigo}
            />
          )}
        </Col>
        <Col xs={12} md={8}>
          <CampoFormulario
            id="producto-nombre"
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            error={errores.nombre}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={6}>
          <CampoSelector
            id="producto-categoria"
            label="Categoría"
            placeholder="Selecciona una categoría"
            opciones={opcionesCategoria}
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            error={errores.categoriaId}
          />
        </Col>
        <Col xs={12} md={3}>
          <CampoFormulario
            id="producto-marca"
            label="Marca"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
          />
        </Col>
        <Col xs={12} md={3}>
          <CampoFormulario
            id="producto-unidad"
            label="Unidad de venta"
            value={unidad}
            onChange={(e) => setUnidad(e.target.value)}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={4}>
          <CampoFormulario
            id="producto-precio"
            label="Precio de venta"
            type="number"
            value={precioVenta}
            onChange={(e) => setPrecioVenta(e.target.value)}
            error={errores.precioVenta}
          />
        </Col>
        <Col xs={6} md={4}>
          <CampoFormulario
            id="producto-stock"
            label="Stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            error={errores.stock}
          />
        </Col>
        <Col xs={6} md={4}>
          <CampoFormulario
            id="producto-stock-minimo"
            label="Stock mínimo"
            type="number"
            value={stockMinimo}
            onChange={(e) => setStockMinimo(e.target.value)}
            error={errores.stockMinimo}
          />
        </Col>
      </Row>

      <CampoCasilla
        id="producto-oferta"
        label="Producto en oferta"
        checked={oferta}
        onChange={(e) => setOferta(e.target.checked)}
      />
      {oferta && (
        <CampoFormulario
          id="producto-precio-oferta"
          label="Precio de oferta"
          type="number"
          value={precioOferta}
          onChange={(e) => setPrecioOferta(e.target.value)}
          error={errores.precioOferta}
        />
      )}
      <CampoCasilla
        id="producto-destacado"
        label="Producto destacado"
        checked={destacado}
        onChange={(e) => setDestacado(e.target.checked)}
      />

      <div className="d-flex justify-content-end gap-2">
        <Boton texto="Cancelar" variante="outline-secondary" onClick={props.onCancelar} />
        <Boton texto={esEdicion ? "Guardar cambios" : "Crear producto"} type="submit" />
      </div>
    </Form>
  );
}

export default FormularioProducto;
