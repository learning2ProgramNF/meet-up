// src/main.jsx

import * as atatus from 'atatus-spa';
atatus.config('3843fb33ac34415b88d21c8bce90a7d3').install(); 

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


