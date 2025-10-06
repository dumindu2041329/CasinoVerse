import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Bomb, Dices, Coins, TrendingUp, Grid3x3, Zap, Target } from 'lucide-react';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const games = [
    {
      name: 'Mines',
      path: '/games/mines',
      icon: Bomb,
      description: 'Find safe tiles and avoid hidden mines',
      color: 'from-red-500 to-orange-500'
    },
    {
      name: 'Dice',
      path: '/games/dice',
      icon: Dices,
      description: 'Roll the dice and predict the outcome',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Plinko',
      path: '/games/plinko',
      icon: Coins,
      description: 'Drop the ball and win big prizes',
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Limbo',
      path: '/games/limbo',
      icon: TrendingUp,
      description: 'Predict the multiplier threshold',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Keno',
      path: '/games/keno',
      icon: Grid3x3,
      description: 'Pick numbers and match them to win',
      color: 'from-yellow-500 to-amber-500'
    },
    {
      name: 'Crash',
      path: '/games/crash',
      icon: Zap,
      description: 'Cash out before the multiplier crashes',
      color: 'from-red-500 to-pink-500'
    },
    {
      name: 'Roulette',
      path: '/games/roulette',
      icon: Target,
      description: 'Classic casino roulette game',
      color: 'from-indigo-500 to-purple-500'
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-casino-gold to-yellow-300 bg-clip-text text-transparent">
          Welcome to CasinoVerse
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Experience the thrill of casino gaming with provably fair mechanics and instant payouts
        </p>
        {!isAuthenticated && (
          <div className="flex items-center justify-center space-x-4">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-3">
              Login
            </Link>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="w-16 h-16 bg-casino-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎲</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Provably Fair</h3>
          <p className="text-gray-400">
            All games use cryptographic algorithms to ensure fairness and transparency
          </p>
        </div>
        <div className="card text-center">
          <div className="w-16 h-16 bg-casino-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚡</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Instant Payouts</h3>
          <p className="text-gray-400">
            Win and withdraw your earnings instantly with no delays
          </p>
        </div>
        <div className="card text-center">
          <div className="w-16 h-16 bg-casino-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Secure & Safe</h3>
          <p className="text-gray-400">
            Your data and funds are protected with industry-standard security
          </p>
        </div>
      </div>

      {/* Games Grid */}
      <div>
        <h2 className="text-3xl font-bold mb-8 text-center">Our Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <Link
                key={game.path}
                to={isAuthenticated ? game.path : '/login'}
                className="group card hover:scale-105 transition-transform duration-200"
              >
                <div className={`w-full h-32 bg-gradient-to-br ${game.color} rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow`}>
                  <Icon className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{game.name}</h3>
                <p className="text-gray-400 text-sm">{game.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      {!isAuthenticated && (
        <div className="card text-center bg-gradient-to-r from-casino-accent to-casino-secondary">
          <h2 className="text-3xl font-bold mb-4">Ready to Play?</h2>
          <p className="text-gray-300 mb-6 max-w-md mx-auto">
            Join thousands of players and start your winning journey today!
          </p>
          <Link to="/register" className="btn-primary text-lg px-8 py-3 inline-block">
            Create Free Account
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
