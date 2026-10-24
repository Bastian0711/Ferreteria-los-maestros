# Ferretería Los Maestros

## Integrantes
- Bastián Araneda (ba.aranedaa@duocuc.cl)
- Misael Concha (mis.concha@duocuc.cl)

## Caso
Ferretería Los Maestros

## Descripción del caso
Tienda en línea de una ferretería de La Serena que atiende a clientes particulares y a contratistas.
La aplicación permite iniciar sesión o crear una cuenta, explorar el catálogo de 85 productos,
agregarlos a una solicitud (carrito), confirmar el pedido y ver su estado. Los contratistas con
cuenta corriente no pagan al momento: su pedido queda como "Pago pendiente a fin de mes".
El rol administrador tiene un panel con un resumen del negocio (stock crítico, pedidos pendientes,
ventas) y la gestión del catálogo (crear, editar y eliminar productos).

Los datos se guardan en el navegador (localStorage): es una simulación académica, sin servidor.

## Estructura del proyecto
```
src/
├── components/
│   ├── atoms/        Boton, CampoTexto, Selector, Precio, ImagenProducto...
│   ├── molecules/    CampoFormulario, TarjetaProducto, FilaItemCarrito...
│   ├── organisms/    FormularioLogin, GrillaProductos, ListaCarrito, TablaProductosAdmin...
│   └── templates/    PlantillaPublica, PlantillaAdmin
├── pages/            una página por ruta (Inicio, Catalogo, Carrito, AdminProductos...)
├── context/          estado compartido: Auth, Catalogo y Carrito
├── services/         authService, productosService, pedidosService
├── data/             baseDatos.js (CRUD simulado) y productosSemilla.js
├── routes/           RutaProtegida (acceso según rol)
├── hooks/            useTituloPagina
└── utils/            funciones puras: precios, filtros, carrito, validaciones
```

Las dependencias van en una sola dirección: páginas → contexto → servicios → datos.
Los componentes solo reciben props.

## Tecnologías
- React + Vite
- React Bootstrap
- React Router
- Vitest + Testing Library (pruebas)

## Cómo ejecutar el proyecto
```
npm install
npm run dev
```

Otros comandos:
```
npm run test:run   # todas las pruebas
npm run test:cov   # pruebas + cobertura
npm run lint       # revisión de código
npm run build      # versión de producción
```

## Usuarios de prueba

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Administrador | admin@maestros.cl | `Admin123!` |
| Cliente con cuenta corriente | contratista@maestros.cl | `Contratista123!` |
| Cliente | cliente@maestros.cl | `Cliente123!` |

Cualquier persona puede crear una cuenta en `/registro`; siempre se crea como cliente.

## Pantallas
- **Públicas:** Inicio, Catálogo, Detalle de producto, Carrito, Checkout, Resultado del pedido, Contacto, Iniciar sesión, Registro y página 404.
- **Administración (solo admin):** Resumen (`/admin`) y Productos (`/admin/productos`).

## Pruebas y cobertura
Cada archivo de código tiene su archivo de prueba al lado (Vitest + Testing Library), con la estructura
suite → caso → aserción y el patrón AAA (Arrange, Act, Assert). Se usan mocks para funciones,
`localStorage` y servicios.

**413 pruebas pasando, en 73 archivos de test.**

| Métrica | Resultado | Mínimo |
| --- | --- | --- |
| Líneas | 95,07 % | 80 % |
| Funciones | 89,03 % | 80 % |
| Ramas | 92,05 % | 70 % |
| Sentencias | 95,13 % | 80 % |

### Análisis de los resultados


## Material complementario
Carpeta de Drive con documentos del semestre (ERS y otros):
https://drive.google.com/drive/folders/12d1VxsNbwjdU00CnV5YNr6qBEvqrS7UX
