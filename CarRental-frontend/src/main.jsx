import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AvailableCars } from './pages/AvailableCars/AvailableCars.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AvailableCars/>
    {/* <App/> */}
  </StrictMode>,
)
