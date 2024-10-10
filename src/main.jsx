import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { FirebaseProvider } from './Context/firebase';

const rootElement = document.getElementById('root');

createRoot(rootElement).render(
  <StrictMode>
    <FirebaseProvider >
      <App />
    </FirebaseProvider>
  </StrictMode>
);
