import '@testing-library/jest-dom/vitest'
import { vi, afterEach } from 'vitest'

if (!window.matchMedia) {
  window.matchMedia = (consulta) => ({
    matches: false,
    media: consulta,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}

// pregunta al navegador si la pantalla es chica o grande,
// y para eso usa window.matchMedia. Los navegadores reales 
// lo tienen, pero jsdom, el navegador simulado de Vitest, no
// Por eso npm run dev funcionaba perfecto y solo fallaban 
// los tests que renderizaban PlantillaAdmin

// La sesión (token) vive en sessionStorage: se limpia entre pruebas para que no dependan entre sí
afterEach(() => {
  sessionStorage.clear()
})

// En las pruebas, los servicios no llaman al backend: usan la base simulada (ver test/serviciosSimulados.js).
// Las pruebas de los servicios reales los cargan con vi.importActual.
vi.mock("./services/productosService", async (importOriginal) => {
  const real = await importOriginal()
  const { productosSimulados } = await import("./test/serviciosSimulados")
  return { ...real, ...productosSimulados }
})

vi.mock("./services/pedidosService", async (importOriginal) => {
  const real = await importOriginal()
  const { pedidosSimulados } = await import("./test/serviciosSimulados")
  return { ...real, ...pedidosSimulados }
})
