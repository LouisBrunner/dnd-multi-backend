import {createRoot} from 'react-dom/client'
import {App} from './App.js'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('could not find root element')
}
const root = createRoot(rootElement)
root.render(<App />)
