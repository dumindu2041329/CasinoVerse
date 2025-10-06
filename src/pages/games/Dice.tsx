import React, { useState } from 'react';
import { useWallet } from '../../context/useWallet';
import { generateClientSeed, generateServerSeed, generateRandomNumber } from '../../utils/provablyFair';
import { Dices } from 'lucide-react';

const Dice: React.FC = () => {
  const { placeBet, addWinnings } = useWallet();
  const [betAmount, setBetAmount] = useState('10');
  const [prediction, setPrediction] = useState<'over' | 'under'>('over');
  const [target, setTarget] = useState(50);
  const [result, setResult] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [rolling, setRolling] = useState(false);

  const calculateMultiplier = () => {
    const chance = prediction === 'over' ? (100 - target) : target;
    return (98 / chance);
  };

  const rollDice = () => {
    const bet = parseFloat(betAmount);
    if (isNaN(bet) || bet <= 0) {
      setMessage('Invalid bet amount');
      return;
    }

    if (!placeBet(bet, 'Dice')) {
      setMessage('Insufficient balance');
      return;
    }

    setRolling(true);
    setMessage('');

    // Generate provably fair result
    const clientSeed = generateClientSeed();
    const serverSeed = generateServerSeed();
    const nonce = Date.now();
    
    setTimeout(() => {
      const diceResult = generateRandomNumber(clientSeed, serverSeed, nonce, 0, 100);
      setResult(diceResult);

      const won = (prediction === 'over' && diceResult > target) || 
                   (prediction === 'under' && diceResult < target);

      if (won) {
        const multiplier = calculateMultiplier();
        const winnings = bet * multiplier;
        addWinnings(winnings, 'Dice');
        setMessage(`🎉 You won $${winnings.toFixed(2)}!`);
      } else {
        setMessage('💔 Better luck next time!');
      }

      setRolling(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">🎲 Dice</h1>
        <p className="text-gray-400">Roll the dice and predict the outcome</p>
      </div>

      <div className="card space-y-6">
        {/* Result Display */}
        <div className="text-center py-12">
          {rolling ? (
            <div className="animate-bounce">
              <Dices className="w-32 h-32 mx-auto text-casino-gold" />
            </div>
          ) : result !== null ? (
            <div className="space-y-4">
              <div className="text-7xl font-bold text-casino-gold">{result.toFixed(2)}</div>
              <div className={`text-2xl font-semibold ${
                message.includes('won') ? 'text-casino-success' : 'text-casino-danger'
              }`}>
                {message}
              </div>
            </div>
          ) : (
            <div>
              <Dices className="w-32 h-32 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">Place your bet and roll!</p>
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
              disabled={rolling}
              className="input-field w-full"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Prediction</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPrediction('under')}
                disabled={rolling}
                className={`py-3 rounded-lg font-semibold transition-colors ${
                  prediction === 'under'
                    ? 'bg-casino-gold text-white'
                    : 'bg-casino-accent hover:bg-casino-accent/80'
                }`}
              >
                Under
              </button>
              <button
                onClick={() => setPrediction('over')}
                disabled={rolling}
                className={`py-3 rounded-lg font-semibold transition-colors ${
                  prediction === 'over'
                    ? 'bg-casino-gold text-white'
                    : 'bg-casino-accent hover:bg-casino-accent/80'
                }`}
              >
                Over
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Target: {target.toFixed(2)}
          </label>
          <input
            type="range"
            value={target}
            onChange={(e) => setTarget(parseFloat(e.target.value))}
            disabled={rolling}
            min="1"
            max="99"
            step="0.01"
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1.00</span>
            <span>99.00</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-casino-accent/20 rounded-lg text-center">
            <div className="text-gray-400 text-sm mb-1">Win Chance</div>
            <div className="text-2xl font-bold text-casino-gold">
              {prediction === 'over' ? (100 - target).toFixed(2) : target.toFixed(2)}%
            </div>
          </div>
          <div className="p-4 bg-casino-accent/20 rounded-lg text-center">
            <div className="text-gray-400 text-sm mb-1">Multiplier</div>
            <div className="text-2xl font-bold text-casino-gold">
              {calculateMultiplier().toFixed(2)}x
            </div>
          </div>
        </div>

        <button
          onClick={rollDice}
          disabled={rolling}
          className="btn-primary w-full text-lg py-4"
        >
          {rolling ? 'Rolling...' : 'Roll Dice'}
        </button>
      </div>
    </div>
  );
};

export default Dice;
