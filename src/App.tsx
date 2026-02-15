import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import Layout from './Layout';
import { ArchiveView } from './views/ArchiveView';

export default function App() {
  return (
    <Router future={{ v7_startTransition: true }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />}></Route>
          <Route path="archive" element={<ArchiveView />} />
          <Route path="*" element={<Home />}></Route>
        </Route>
      </Routes>
    </Router>
  );
}
