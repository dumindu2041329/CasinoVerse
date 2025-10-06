import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { useAuth } from './context/useAuth';
import { WalletProvider } from './context/WalletContext.tsx';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Mines from './pages/games/Mines';
import Dice from './pages/games/Dice';
import Plinko from './pages/games/Plinko';
import Limbo from './pages/games/Limbo';
import Keno from './pages/games/Keno';
import Crash from './pages/games/Crash';
import Roulette from './pages/games/Roulette';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <WalletProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes with Layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              
              {/* Game Routes */}
              <Route
                path="/games/mines"
                element={
                  <ProtectedRoute>
                    <Mines />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/dice"
                element={
                  <ProtectedRoute>
                    <Dice />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/plinko"
                element={
                  <ProtectedRoute>
                    <Plinko />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/limbo"
                element={
                  <ProtectedRoute>
                    <Limbo />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/keno"
                element={
                  <ProtectedRoute>
                    <Keno />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/crash"
                element={
                  <ProtectedRoute>
                    <Crash />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/roulette"
                element={
                  <ProtectedRoute>
                    <Roulette />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </WalletProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
