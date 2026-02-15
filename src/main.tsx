import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'preline/preline';
import './index.css';
import App from './App.tsx';
import { ThirdwebProvider } from 'thirdweb/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Импорт QueryClient и QueryClientProvider
import { client } from './lib/thirdweb/client'; // Import client
import { chain } from './lib/thirdweb/chain'; // Import chain

const queryClient = new QueryClient(); // Создание экземпляра QueryClient

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {' '}
      {/* Оборачиваем в QueryClientProvider */}
      <ThirdwebProvider client={client} chains={[chain]}>
        <App />
      </ThirdwebProvider>
    </QueryClientProvider>
  </StrictMode>,
);

