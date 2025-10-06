import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import 'leaflet/dist/leaflet.css'
import App from './App.jsx'
import Header from './components/Layout/Header';
import Graph from './Graph.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header />
    <App />
  </StrictMode>,
)

