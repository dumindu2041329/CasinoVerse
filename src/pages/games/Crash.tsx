import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '../../context/useWallet';
import { generateClientSeed, generateServerSeed, generateRandomFloat } from '../../utils/provablyFair';
import { Zap } from 'lucide-react';

const Crash: React.FC = () => {
  const { placeBet, addWinnings } = useWallet();
  const [betAmount, setBetAmount] = useState('10');
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [crashPoint, setCrashPoint] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'betting' | 'running' | 'crashed'>('betting');
  const [cashedOut, setCashedOut] = useState(false);
  const [cashoutMultiplier, setCashoutMultiplier] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = () => {
    const bet = parseFloat(betAmount);
    if (isNaN(bet) || bet <= 0) {
      setMessage('Invalid bet amount');
      return;
    }

    if (!placeBet(bet, 'Crash')) {
      setMessage('Insufficient balance');
      return;
    }

    // Generate crash point using provably fair
    const clientSeed = generateClientSeed();
    const serverSeed = generateServerSeed();
    const random = generateRandomFloat(clientSeed, serverSeed, Date.now());
    
    // Generate crash point (1.00 to 100.00)
    const crash = Math.max(1.01, 1 / (1 - random * 0.99));
    setCrashPoint(crash);
    
    setGameState('running');
    setCashedOut(false);
    setCashoutMultiplier(null);
    setMessage('');
    setCurrentMultiplier(1.00);

    // Animate multiplier
    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const mult = 1 + elapsed * 0.5; // Increases by 0.5x per second
      
      if (mult >= crash) {
        setCurrentMultiplier(crash);
        setGameState('crashed');
        if (!cashedOut) {
          setMessage('💥 CRASHED! You lost.');
        }
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else {
        setCurrentMultiplier(mult);
      }
    }, 50);
  };

  const cashOut = () => {
    if (gameState !== 'running' || cashedOut) return;

    setCashedOut(true);
    setCashoutMultiplier(currentMultiplier);
    
    const bet = parseFloat(betAmount);
    const winnings = bet * currentMultiplier;
    addWinnings(winnings, 'Crash');
    setMessage(`🎉 Cashed out at ${currentMultiplier.toFixed(2)}x! Won $${winnings.toFixed(2)}`);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (gameState === 'crashed' || gameState === 'betting') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [gameState]);

  const resetGame = () => {
    setGameState('betting');
    setCurrentMultiplier(1.00);
    setCrashPoint(null);
    setCashedOut(false);
    setCashoutMultiplier(null);
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">⚡ Crash</h1>
        <p className="text-gray-400">Cash out before the multiplier crashes!</p>
      </div>

      <div className="card space-y-6">
        {/* Multiplier Display */}
        <div className={`text-center py-16 rounded-lg ${
          gameState === 'crashed' 
            ? 'bg-casino-danger/20' 
            : gameState === 'running'
            ? 'bg-casino-success/20'
            : 'bg-casino-accent/20'
        }`}>
          {gameState === 'crashed' ? (
            <div className="space-y-4">
              <Zap className="w-24 h-24 mx-auto text-casino-danger" />
              <div className="text-6xl font-bold text-casino-danger">
                CRASHED!
              </div>
              <div className="text-3xl font-semibold text-white">
                @ {crashPoint?.toFixed(2)}x
              </div>
            </div>
          ) : (
            <div className={`text-8xl font-bold ${
              gameState === 'running' ? 'text-casino-gold animate-pulse' : 'text-gray-400'
            }`}>
              {currentMultiplier.toFixed(2)}x
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {gameState === 'betting' && (
            <div>
              <label className="block text-sm font-medium mb-2">Bet Amount</label>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="input-field w-full"
                min="0"
                step="0.01"
              />
            </div>
          )}

          {message && (
            <div className={`p-4 rounded-lg text-center font-semibold ${
              message.includes('Won') || message.includes('🎉')
                ? 'bg-casino-success/20 text-casino-success'
                : 'bg-casino-danger/20 text-casino-danger'
            }`}>
              {message}
            </div>
          )}

          {gameState === 'betting' && (
            <button onClick={startGame} className="btn-primary w-full text-lg py-4">
              Start Game
            </button>
          )}

          {gameState === 'running' && !cashedOut && (
            <button 
              onClick={cashOut} 
              className="btn-primary w-full text-lg py-4 bg-casino-success hover:bg-casino-success/90"
            >
              Cash Out ${(parseFloat(betAmount) * currentMultiplier).toFixed(2)}
            </button>
          )}

          {gameState === 'crashed' && (
            <button onClick={resetGame} className="btn-primary w-full text-lg py-4">
              Play Again
            </button>
          )}

          {cashedOut && (
            <div className="p-4 bg-casino-success/20 rounded-lg text-center">
              <div className="text-casino-success font-bold text-xl">
                Cashed Out @ {cashoutMultiplier?.toFixed(2)}x
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Crash;
