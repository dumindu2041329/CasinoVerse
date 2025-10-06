import React, { useState } from 'react';
import { useWallet } from '../../context/useWallet';
import { generateClientSeed, generateServerSeed, generateRandomNumber } from '../../utils/provablyFair';
import { Target } from 'lucide-react';

type BetType = 'number' | 'red' | 'black' | 'even' | 'odd' | 'low' | 'high';

interface Bet {
  type: BetType;
  value: number | null;
  amount: string;
}

const Roulette: React.FC = () => {
  const { placeBet, addWinnings } = useWallet();
  const [variant, setVariant] = useState<'european' | 'american'>('european');
  const [bets, setBets] = useState<Bet[]>([{ type: 'number', value: null, amount: '10' }]);
  const [result, setResult] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [spinning, setSpinning] = useState(false);

  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const maxNumber = variant === 'european' ? 36 : 37; // European: 0-36, American: 0-37 (00)

  const isRed = (num: number) => redNumbers.includes(num);
  const isBlack = (num: number) => num > 0 && !isRed(num);
  const isEven = (num: number) => num > 0 && num % 2 === 0;
  const isOdd = (num: number) => num > 0 && num % 2 !== 0;
  const isLow = (num: number) => num >= 1 && num <= 18;
  const isHigh = (num: number) => num >= 19 && num <= 36;

  const checkWin = (bet: Bet, spinResult: number): boolean => {
    switch (bet.type) {
      case 'number':
        return bet.value === spinResult;
      case 'red':
        return isRed(spinResult);
      case 'black':
        return isBlack(spinResult);
      case 'even':
        return isEven(spinResult);
      case 'odd':
        return isOdd(spinResult);
      case 'low':
        return isLow(spinResult);
      case 'high':
        return isHigh(spinResult);
      default:
        return false;
    }
  };

  const getMultiplier = (betType: BetType): number => {
    return betType === 'number' ? 36 : 2;
  };

  const spin = () => {
    // Validate all bets
    let totalBet = 0;
    for (const bet of bets) {
      const amount = parseFloat(bet.amount);
      if (isNaN(amount) || amount <= 0) {
        setMessage('Invalid bet amount');
        return;
      }
      if (bet.type === 'number' && (bet.value === null || bet.value < 0 || bet.value > maxNumber)) {
        setMessage('Invalid number selection');
        return;
      }
      totalBet += amount;
    }

    if (!placeBet(totalBet, 'Roulette')) {
      setMessage('Insufficient balance');
      return;
    }

    setSpinning(true);
    setMessage('');

    const clientSeed = generateClientSeed();
    const serverSeed = generateServerSeed();
    
    setTimeout(() => {
      const spinResult = generateRandomNumber(clientSeed, serverSeed, Date.now(), 0, maxNumber);
      setResult(spinResult);

      let totalWinnings = 0;
      let winningBets = 0;

      bets.forEach(bet => {
        if (checkWin(bet, spinResult)) {
          const amount = parseFloat(bet.amount);
          const multiplier = getMultiplier(bet.type);
          totalWinnings += amount * multiplier;
          winningBets++;
        }
      });

      if (totalWinnings > 0) {
        addWinnings(totalWinnings, 'Roulette');
        setMessage(`🎉 You won $${totalWinnings.toFixed(2)} on ${winningBets} bet(s)!`);
      } else {
        setMessage('💔 Better luck next time!');
      }

      setSpinning(false);
    }, 3000);
  };

  const addBet = () => {
    setBets([...bets, { type: 'number', value: null, amount: '10' }]);
  };

  const removeBet = (index: number) => {
    setBets(bets.filter((_, i) => i !== index));
  };

  const updateBet = (index: number, updates: Partial<Bet>) => {
    const newBets = [...bets];
    newBets[index] = { ...newBets[index], ...updates };
    setBets(newBets);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">🎯 Roulette</h1>
        <p className="text-gray-400">Place your bets and spin the wheel</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="card space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Variant</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setVariant('european')}
                disabled={spinning}
                className={`py-3 rounded-lg font-semibold transition-colors ${
                  variant === 'european'
                    ? 'bg-casino-gold text-white'
                    : 'bg-casino-accent hover:bg-casino-accent/80'
                }`}
              >
                European
              </button>
              <button
                onClick={() => setVariant('american')}
                disabled={spinning}
                className={`py-3 rounded-lg font-semibold transition-colors ${
                  variant === 'american'
                    ? 'bg-casino-gold text-white'
                    : 'bg-casino-accent hover:bg-casino-accent/80'
                }`}
              >
                American
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">Your Bets</h3>
              <button
                onClick={addBet}
                disabled={spinning}
                className="text-sm bg-casino-accent hover:bg-casino-accent/80 px-3 py-1 rounded"
              >
                + Add Bet
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {bets.map((bet, index) => (
                <div key={index} className="p-3 bg-casino-accent/20 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <select
                      value={bet.type}
                      onChange={(e) => updateBet(index, { type: e.target.value as BetType, value: null })}
                      disabled={spinning}
                      className="input-field flex-1 mr-2"
                    >
                      <option value="number">Number</option>
                      <option value="red">Red</option>
                      <option value="black">Black</option>
                      <option value="even">Even</option>
                      <option value="odd">Odd</option>
                      <option value="low">Low (1-18)</option>
                      <option value="high">High (19-36)</option>
                    </select>
                    {bets.length > 1 && (
                      <button
                        onClick={() => removeBet(index)}
                        disabled={spinning}
                        className="text-casino-danger hover:bg-casino-danger/20 px-2 rounded"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {bet.type === 'number' && (
                    <input
                      type="number"
                      value={bet.value ?? ''}
                      onChange={(e) => updateBet(index, { value: parseInt(e.target.value) })}
                      disabled={spinning}
                      placeholder={`Number (0-${maxNumber})`}
                      className="input-field w-full"
                      min="0"
                      max={maxNumber}
                    />
                  )}

                  <input
                    type="number"
                    value={bet.amount}
                    onChange={(e) => updateBet(index, { amount: e.target.value })}
                    disabled={spinning}
                    placeholder="Bet amount"
                    className="input-field w-full"
                    min="0"
                    step="0.01"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={spin}
            disabled={spinning}
            className="btn-primary w-full text-lg py-4"
          >
            {spinning ? 'Spinning...' : 'Spin'}
          </button>

          {message && (
            <div className={`p-4 rounded-lg text-center font-semibold ${
              message.includes('won') || message.includes('🎉')
                ? 'bg-casino-success/20 text-casino-success'
                : 'bg-casino-danger/20 text-casino-danger'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Wheel Visualization */}
        <div className="lg:col-span-2 card">
          <div className="text-center py-12">
            {spinning ? (
              <div>
                <div className="w-64 h-64 mx-auto rounded-full border-8 border-casino-gold animate-spin-slow flex items-center justify-center bg-gradient-to-br from-casino-accent to-casino-secondary">
                  <Target className="w-32 h-32 text-casino-gold" />
                </div>
                <p className="mt-6 text-xl text-casino-gold font-semibold">Spinning...</p>
              </div>
            ) : result !== null ? (
              <div className="space-y-6">
                <div
                  className={`w-64 h-64 mx-auto rounded-full flex items-center justify-center text-8xl font-bold ${
                    result === 0
                      ? 'bg-green-600'
                      : isRed(result)
                      ? 'bg-red-600'
                      : 'bg-black'
                  }`}
                >
                  {result}
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-semibold">
                    {result === 0 ? 'Zero' : ''}
                    {isRed(result) ? 'Red' : ''}
                    {isBlack(result) ? 'Black' : ''}
                  </div>
                  {result !== 0 && (
                    <div className="text-gray-400">
                      {isEven(result) ? 'Even' : 'Odd'} • {isLow(result) ? 'Low' : 'High'}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="w-64 h-64 mx-auto rounded-full border-8 border-gray-600 flex items-center justify-center bg-casino-accent">
                  <Target className="w-32 h-32 text-gray-600" />
                </div>
                <p className="mt-6 text-gray-400">Place your bets and spin!</p>
              </div>
            )}
          </div>

          {/* Number Board */}
          <div className="mt-6 grid grid-cols-12 gap-1">
            <div className={`col-span-12 p-2 text-center font-bold rounded bg-green-600`}>
              0
            </div>
            {[...Array(36)].map((_, i) => {
              const num = i + 1;
              return (
                <div
                  key={num}
                  className={`col-span-4 sm:col-span-3 lg:col-span-1 aspect-square flex items-center justify-center font-bold rounded ${
                    isRed(num) ? 'bg-red-600' : 'bg-black'
                  } ${result === num ? 'ring-4 ring-casino-gold' : ''}`}
                >
                  {num}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roulette;
