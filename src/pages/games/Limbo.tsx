import React, { useState } from 'react';
import { useWallet } from '../../context/useWallet';
import { generateClientSeed, generateServerSeed, generateRandomFloat } from '../../utils/provablyFair';
import { TrendingUp } from 'lucide-react';

const Limbo: React.FC = () => {
  const { placeBet, addWinnings } = useWallet();
  const [betAmount, setBetAmount] = useState('10');
  const [targetMultiplier, setTargetMultiplier] = useState('2.00');
  const [result, setResult] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const bet = parseFloat(betAmount);
    const target = parseFloat(targetMultiplier);

    if (isNaN(bet) || bet <= 0) {
      setMessage('Invalid bet amount');
      return;
    }

    if (isNaN(target) || target < 1.01) {
      setMessage('Target multiplier must be at least 1.01');
      return;
    }

    if (!placeBet(bet, 'Limbo')) {
      setMessage('Insufficient balance');
      return;
    }

    setPlaying(true);
    setMessage('');

    const clientSeed = generateClientSeed();
    const serverSeed = generateServerSeed();
    
    setTimeout(() => {
      // Generate result multiplier (1.00 to 1,000,000)
      const random = generateRandomFloat(clientSeed, serverSeed, Date.now());
      const resultMultiplier = 1.0 / (1.0 - random * 0.99);
      
      setResult(resultMultiplier);

      if (resultMultiplier >= target) {
        const winnings = bet * target;
        addWinnings(winnings, 'Limbo');
        setMessage(`🎉 You won! Result: ${resultMultiplier.toFixed(2)}x - Won $${winnings.toFixed(2)}`);
      } else {
        setMessage(`💔 You lost! Result: ${resultMultiplier.toFixed(2)}x was under ${target}x`);
      }

      setPlaying(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">📈 Limbo</h1>
        <p className="text-gray-400">Predict the multiplier threshold</p>
      </div>

      <div className="card space-y-6">
        {/* Result Display */}
        <div className="text-center py-12">
          {playing ? (
            <div>
              <TrendingUp className="w-32 h-32 mx-auto text-casino-gold animate-pulse" />
              <p className="mt-4 text-xl text-gray-400">Calculating...</p>
            </div>
          ) : result !== null ? (
            <div className="space-y-4">
              <div className="text-7xl font-bold text-casino-gold">
                {result.toFixed(2)}x
              </div>
              <div className={`text-2xl font-semibold ${
                message.includes('won') ? 'text-casino-success' : 'text-casino-danger'
              }`}>
                {message}
              </div>
            </div>
          ) : (
            <div>
              <TrendingUp className="w-32 h-32 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">Set your target and play!</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Bet Amount</label>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              disabled={playing}
              className="input-field w-full"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Target Multiplier</label>
            <input
              type="number"
              value={targetMultiplier}
              onChange={(e) => setTargetMultiplier(e.target.value)}
              disabled={playing}
              className="input-field w-full"
              min="1.01"
              step="0.01"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[2, 5, 10].map((mult) => (
            <button
              key={mult}
              onClick={() => setTargetMultiplier(mult.toFixed(2))}
              disabled={playing}
              className="bg-casino-accent hover:bg-casino-accent/80 py-3 rounded-lg font-semibold transition-colors"
            >
              {mult}x
            </button>
          ))}
        </div>

        <div className="p-4 bg-casino-accent/20 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Win Chance:</span>
            <span className="font-bold">{(98 / parseFloat(targetMultiplier || '2')).toFixed(2)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Potential Win:</span>
            <span className="font-bold text-casino-gold">
              ${(parseFloat(betAmount || '0') * parseFloat(targetMultiplier || '2')).toFixed(2)}
            </span>
          </div>
        </div>

        <button
          onClick={play}
          disabled={playing}
          className="btn-primary w-full text-lg py-4"
        >
          {playing ? 'Playing...' : 'Play'}
        </button>
      </div>
    </div>
  );
};

export default Limbo;
