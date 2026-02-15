import { Outlet } from 'react-router-dom';
import { Header } from './parts/Header';
import { Footer } from './parts/Footer';
import { useDeVoteContract } from './hooks/useDeVoteContract';
import { DeVoteContext } from './contexts/DeVoteContext';

export default function Layout() {
  const deVoteData = useDeVoteContract();

  return (
    <DeVoteContext.Provider value={deVoteData}>
      <div className="flex flex-col min-h-full">
        <div>
          <Header />
        </div>
        <main className="grow">
          <Outlet />
        </main>
        <div>
          <Footer />
        </div>
      </div>
    </DeVoteContext.Provider>
  );
}
