import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Groups from './pages/Groups';
import GroupDetails from './pages/GroupDetails';
import Landing from './pages/Landing';
import Login from './pages/Login';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from './store/slices/userSlice';
import { TamboProvider } from "@tambo-ai/react";
import { tamboComponents } from './lib/tambo/components';

const ProtectedRoute = ({ children }) => {
  const user = useSelector(selectCurrentUser);
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const apiKey = import.meta.env.VITE_TAMBO_API_KEY;

  return (
    <TamboProvider apiKey={apiKey} components={tamboComponents}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Protected App Routes */}
          <Route path="/app" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="groups" element={<Groups />} />
            <Route path="groups/:groupId" element={<GroupDetails />} />
            <Route path="analytics" element={<Dashboard />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TamboProvider>
  );
}

export default App;
