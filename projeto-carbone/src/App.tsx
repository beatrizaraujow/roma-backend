import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Professores } from './pages/Professores';
import { ComponentesCurriculares } from './pages/ComponentesCurriculares';
import { Checkout } from './pages/Checkout';
import { PagamentoPix } from './pages/PagamentoPix';
import { PagamentoSucesso } from './pages/PagamentoSucesso';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/professores" element={<Professores />} />
        <Route path="/componentes-curriculares" element={<ComponentesCurriculares />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pagamento/pix" element={<PagamentoPix />} />
        <Route path="/pagamento/sucesso" element={<PagamentoSucesso />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
