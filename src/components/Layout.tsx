import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useWallet } from '../context/useWallet';
import { Menu, X, Wallet, LogOut, User, Home } from 'lucide-react';
import WalletModal from './WalletModal';

const Layout: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { balance } = useWallet();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const games = [
    { name: 'Mines', path: '/games/mines' },
    { name: 'Dice', path: '/games/dice' },
    { name: 'Plinko', path: '/games/plinko' },
    { name: 'Limbo', path: '/games/limbo' },
    { name: 'Keno', path: '/games/keno' },
    { name: 'Crash', path: '/games/crash' },
    { name: 'Roulette', path: '/games/roulette' },
  ];

  return (
    <div className="min-h-screen bg-casino-primary">
      {/* Header */}
      <header className="bg-casino-secondary border-b border-casino-accent/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-casino-gold rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold">🎰</span>
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">CasinoVerse</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-1">
              <Link to="/" className="px-4 py-2 rounded-lg hover:bg-casino-accent transition-colors">
                <Home className="inline w-4 h-4 mr-2" />
                Home
              </Link>
              {games.map((game) => (
                <Link
                  key={game.path}
                  to={game.path}
                  className="px-4 py-2 rounded-lg hover:bg-casino-accent transition-colors"
                >
                  {game.name}
                </Link>
              ))}
            </nav>

            {/* User Section */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsWalletModalOpen(true)}
                  className="flex items-center space-x-2 bg-casino-accent hover:bg-casino-accent/80 px-4 py-2 rounded-lg transition-colors"
                >
                  <Wallet className="w-5 h-5" />
                  <span className="font-semibold">${balance.toFixed(2)}</span>
                </button>
                
                <div className="hidden md:flex items-center space-x-2 bg-casino-accent px-4 py-2 rounded-lg">
                  <User className="w-5 h-5" />
                  <span>{user.username}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="bg-casino-gold hover:bg-casino-gold/90 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>

                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-2 hover:bg-casino-accent rounded-lg"
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="lg:hidden py-4 border-t border-casino-accent/30">
              <div className="flex flex-col space-y-2">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 rounded-lg hover:bg-casino-accent transition-colors"
                >
                  Home
                </Link>
                {games.map((game) => (
                  <Link
                    key={game.path}
                    to={game.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 rounded-lg hover:bg-casino-accent transition-colors"
                  >
                    {game.name}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-casino-secondary border-t border-casino-accent/30 mt-auto py-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400">
            <p className="mb-2">© 2025 CasinoVerse. All rights reserved.</p>
            <p className="text-sm">Play responsibly. Must be 18+ to play.</p>
          </div>
        </div>
      </footer>

      {/* Wallet Modal */}
      {isWalletModalOpen && (
        <WalletModal onClose={() => setIsWalletModalOpen(false)} />
      )}
    </div>
  );
};

export default Layout;
