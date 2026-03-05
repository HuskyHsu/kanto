import { LanguageProvider } from '@/contexts/LanguageContext';
import { MoveProvider } from '@/contexts/MoveContext';
import { PokemonProvider } from '@/contexts/PokemonContext';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <LanguageProvider>
        <PokemonProvider>
          <MoveProvider>
            <App />
          </MoveProvider>
        </PokemonProvider>
      </LanguageProvider>
    </HashRouter>
  </StrictMode>
);
