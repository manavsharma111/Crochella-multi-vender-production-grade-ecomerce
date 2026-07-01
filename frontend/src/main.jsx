import { StrictMode } from "react"

// Suppress the THREE.Clock deprecation warning from React Three Fiber / Three.js
const originalWarn = console.warn
console.warn = (...args) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("THREE.Clock: This module has been deprecated")
  )
    return
  originalWarn(...args)
}
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { store } from "./redux/store.js"
import "./index.css"
import App from "./App.jsx"
import ErrorBoundary from "./components/common/ErrorBoundary.jsx"
import { registerSW } from "virtual:pwa-register"

registerSW({ immediate: true })

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
