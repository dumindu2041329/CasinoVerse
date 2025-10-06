import React, { useState } from 'react';
import { useWallet } from '../../context/useWallet';
import { generateClientSeed, generateServerSeed, generateRandomNumber } from '../../utils/provablyFair';

const TOTAL_NUMBERS = 40;
const MAX_SELECTIONS = 10;
const DRAWN_NUMBERS = 10;

const Keno: React.FC = () => {
  const { placeBet, addWinnings } = useWallet();
  const [betAmount, setBetAmount] = useState('10');
  const [selectedNumbers, setSelectedNumbers] = useState<Set<number>>(new Set());
  const [drawnNumbers, setDrawnNumbers] = useState<Set<number>>(new Set());
  const [message, setMessage] = useState('');
  const [playing, setPlaying] = useState(false);

  const toggleNumber = (num: number) => {
    if (playing) return;
    
    const newSelected = new Set(selectedNumbers);
    if (newSelected.has(num)) {
      newSelected.delete(num);
    } else if (newSelected.size < MAX_SELECTIONS) {
      newSelected.add(num);
    }
    setSelectedNumbers(newSelected);
  };

  const getMultiplier = (matches: number, picked: number) => {
    const multipliers: { [key: number]: { [key: number]: number } } = {
      1: { 1: 2.0 },
      2: { 1: 0.5, 2: 4.0 },
      3: { 2: 1.5, 3: 10.0 },
      4: { 2: 1.0, 3: 3.0, 4: 20.0 },
      5: { 2: 0.5, 3: 2.0, 4: 8.0, 5: 40.0 },
      6: { 3: 1.5, 4: 4.0, 5: 15.0, 6: 80.0 },
      7: { 3: 1.0, 4: 2.5, 5: 8.0, 6: 30.0, 7: 150.0 },
      8: { 4: 2.0, 5: 5.0, 6: 15.0, 7: 50.0, 8: 300.0 },
      9: { 4: 1.5, 5: 3.0, 6: 10.0, 7: 30.0, 8: 100.0, 9: 500.0 },
      10: { 4: 1.0, 5: 2.0, 6: 5.0, 7: 15.0, 8: 50.0, 9: 200.0, 10: 1000.0 }
    };
    return multipliers[picked]?.[matches] || 0;
  };

  const play = () => {
    const bet = parseFloat(betAmount);
    if (isNaN(bet) || bet <= 0) {
      setMessage('Invalid bet amount');
      return;
    }

    if (selectedNumbers.size === 0) {
      setMessage('Please select at least one number');
      return;
    }

    if (!placeBet(bet, 'Keno')) {
      setMessage('Insufficient balance');
      return;
    }

    setPlaying(true);
    setMessage('');

    const clientSeed = generateClientSeed();
    const serverSeed = generateServerSeed();
    
    setTimeout(() => {
      // Generate drawn numbers
      const drawn = new Set<number>();
      let nonce = 0;
      while (drawn.size < DRAWN_NUMBERS) {
        const num = generateRandomNumber(clientSeed, serverSeed, nonce++, 1, TOTAL_NUMBERS);
        drawn.add(num);
      }
      
      setDrawnNumbers(drawn);

      // Calculate matches
      const matches = [...selectedNumbers].filter(num => drawn.has(num)).length;
      const multiplier = getMultiplier(matches, selectedNumbers.size);

      if (multiplier > 0) {
        const winnings = bet * multiplier;
        addWinnings(winnings, 'Keno');
        setMessage(`🎉 ${matches} matches! Won $${winnings.toFixed(2)} (${multiplier}x)`);
      } else {
        setMessage(`💔 ${matches} matches. Better luck next time!`);
      }

      setPlaying(false);
    }, 2000);
  };

  const clearSelection = () => {
    setSelectedNumbers(new Set());
    setDrawnNumbers(new Set());
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">🎱 Keno</h1>
        <p className="text-gray-400">Pick up to 10 numbers and match them to win</p>
      </div>

      <div className="card space-y-6">
        {/* Number Grid */}
        <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
          {[...Array(TOTAL_NUMBERS)].map((_, index) => {
            const num = index + 1;
            const isSelected = selectedNumbers.has(num);
            const isDrawn = drawnNumbers.has(num);
            const isMatch = isSelected && isDrawn;

            return (
              <button
                key={num}
                onClick={() => toggleNumber(num)}
                disabled={playing}
                className={`aspect-square rounded-lg font-bold text-lg transition-all duration-200 ${
                  isMatch
                    ? 'bg-casino-success text-white scale-110'
                    : isDrawn
                    ? 'bg-casino-gold text-white'
                    : isSelected
                    ? 'bg-casino-accent text-white'
                    : 'bg-casino-secondary hover:bg-casino-accent/50'
                } ${playing ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {num}
              </button>
            );
          })}
        </div>

        {/* Info */}
        <div className="flex justify-between items-center p-4 bg-casino-accent/20 rounded-lg">
          <div>
            <span className="text-gray-400">Selected:</span>
            <span className="ml-2 font-bold">{selectedNumbers.size}/{MAX_SELECTIONS}</span>
          </div>
          {drawnNumbers.size > 0 && (
            <div>
              <span className="text-gray-400">Matches:</span>
              <span className="ml-2 font-bold text-casino-gold">
                {[...selectedNumbers].filter(num => drawnNumbers.has(num)).length}
              </span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
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

          {message && (
            <div className={`p-4 rounded-lg text-center font-semibold ${
              message.includes('Won') || message.includes('🎉')
                ? 'bg-casino-success/20 text-casino-success'
                : 'bg-casino-danger/20 text-casino-danger'
            }`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={clearSelection}
              disabled={playing}
              className="btn-secondary py-3"
            >
              Clear
            </button>
            <button
              onClick={play}
              disabled={playing || selectedNumbers.size === 0}
              className="btn-primary py-3"
            >
              {playing ? 'Drawing...' : 'Play'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Keno;
