// src/main.jsx

import * as atatus from 'atatus-spa';
atatus.config('3843fb33ac34415b88d21c8bce90a7d3').install(); 

import { StrictMode } from 'react'
import './index.css'
import App from './App.jsx'
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';


ReactDOM.createRoot(document.getElementById('root')).render(
 <React.StrictMode>
   <App />
 </React.StrictMode>,
);
serviceWorkerRegistration.register();


