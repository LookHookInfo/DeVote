import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'preline/preline';
import './index.css';
import App from './App.tsx';
import { ThirdwebProvider } from 'thirdweb/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Импорт QueryClient и QueryClientProvider

const queryClient = new QueryClient(); // Создание экземпляра QueryClient

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {' '}
      {/* Оборачиваем в QueryClientProvider */}
      <ThirdwebProvider>
        <App />
      </ThirdwebProvider>
    </QueryClientProvider>
  </StrictMode>,
);

