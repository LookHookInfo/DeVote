import { Outlet } from 'react-router-dom';
import { Header } from './parts/Header';
import { Footer } from './parts/Footer';

export default function Layout() {
  return (
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
  );
}