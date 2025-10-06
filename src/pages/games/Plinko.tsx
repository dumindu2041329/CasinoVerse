import React, { useState } from 'react';
import { useWallet } from '../../context/useWallet';
import { generateClientSeed, generateServerSeed, generateRandomFloat } from '../../utils/provablyFair';

const Plinko: React.FC = () => {
  const { placeBet, addWinnings } = useWallet();
  const [betAmount, setBetAmount] = useState('10');
  const [risk, setRisk] = useState<'low' | 'medium' | 'high'>('medium');
  const [message, setMessage] = useState('');
  const [dropping, setDropping] = useState(false);
  const [lastResult, setLastResult] = useState<{slot: number, multiplier: number} | null>(null);

  const multipliers = {
    low: [1.5, 1.2, 1.1, 1.0, 0.9, 1.0, 1.1, 1.2, 1.5],
    medium: [3.0, 2.0, 1.5, 1.0, 0.5, 1.0, 1.5, 2.0, 3.0],
    high: [10.0, 4.0, 2.0, 0.5, 0.2, 0.5, 2.0, 4.0, 10.0]
  };

  const dropBall = () => {
    const bet = parseFloat(betAmount);
    if (isNaN(bet) || bet <= 0) {
      setMessage('Invalid bet amount');
      return;
    }

    if (!placeBet(bet, 'Plinko')) {
      setMessage('Insufficient balance');
      return;
    }

    setDropping(true);
    setMessage('');

    const clientSeed = generateClientSeed();
    const serverSeed = generateServerSeed();
    
    setTimeout(() => {
      // Determine which slot the ball lands in (0-8)
      const random = generateRandomFloat(clientSeed, serverSeed, Date.now());
      const slot = Math.floor(random * 9);
      const multiplier = multipliers[risk][slot];
      
      setLastResult({ slot, multiplier });

      if (multiplier >= 1.0) {
        const winnings = bet * multiplier;
        addWinnings(winnings, 'Plinko');
        setMessage(`🎉 Landed in slot ${slot + 1}! Won $${winnings.toFixed(2)} (${multiplier}x)`);
      } else {
        const loss = bet * (1 - multiplier);
        setMessage(`💔 Landed in slot ${slot + 1}. Lost $${loss.toFixed(2)} (${multiplier}x)`);
      }

      setDropping(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">🎯 Plinko</h1>
        <p className="text-gray-400">Drop the ball and watch it bounce to a prize</p>
      </div>

      <div className="card space-y-6">
        {/* Plinko Board Visualization */}
        <div className="bg-casino-accent/20 rounded-lg p-8 min-h-[400px] relative">
          <div className="text-center mb-8">
            {dropping ? (
              <div className="animate-bounce">
                <div className="w-8 h-8 bg-casino-gold rounded-full mx-auto"></div>
                <p className="mt-4 text-casino-gold font-semibold">Dropping...</p>
              </div>
            ) : (
              <div className="text-6xl">⬇️</div>
            )}
          </div>

          {/* Prize Slots */}
          <div className="grid grid-cols-9 gap-1 mt-8">
            {multipliers[risk].map((mult, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg text-center transition-all duration-300 ${
                  lastResult?.slot === index
                    ? 'bg-casino-gold scale-110'
                    : mult >= 2.0
                    ? 'bg-green-600'
                    : mult >= 1.0
                    ? 'bg-blue-600'
                    : 'bg-red-600'
                }`}
              >
                <div className="text-xs font-bold">{mult}x</div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Bet Amount</label>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                disabled={dropping}
                className="input-field w-full"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Risk Level</label>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setRisk(level)}
                    disabled={dropping}
                    className={`py-3 rounded-lg font-semibold capitalize transition-colors ${
                      risk === level
                        ? 'bg-casino-gold text-white'
                        : 'bg-casino-accent hover:bg-casino-accent/80'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg text-center font-semibold ${
              message.includes('Won') || message.includes('🎉')
                ? 'bg-casino-success/20 text-casino-success'
                : 'bg-casino-danger/20 text-casino-danger'
            }`}>
              {message}
            </div>
          )}

          <button
            onClick={dropBall}
            disabled={dropping}
            className="btn-primary w-full text-lg py-4"
          >
            {dropping ? 'Dropping...' : 'Drop Ball'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Plinko;
