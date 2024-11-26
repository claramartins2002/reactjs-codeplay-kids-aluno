import React from 'react';
import ReactDOM from 'react-dom/client';
import "@fontsource/irish-grover"; // Defaults to weight 400
import './index.css';
import { AuthProvider } from './AuthContext'; 
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>  
    <App/>
</AuthProvider>
  </React.StrictMode>
);
