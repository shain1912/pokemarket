import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* BASE_URL: 로컬은 '/', GitHub Pages 는 '/<repo>/' */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <ShopProvider>
          <App />
        </ShopProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
