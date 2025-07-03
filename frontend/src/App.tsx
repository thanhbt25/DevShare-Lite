import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Save from './pages/Save';
import Tags from './pages/Tags';
import Users from './pages/Users';
import YourQuestions from './pages/YourQuestions';
import Login from './pages/Login';
import Register from './pages/Register';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useContext(AuthContext);
  return user ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}