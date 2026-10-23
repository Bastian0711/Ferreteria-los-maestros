import '@testing-library/jest-dom/vitest'

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