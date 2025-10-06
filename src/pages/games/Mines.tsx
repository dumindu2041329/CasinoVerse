import React, { useState } from 'react';
import { useWallet } from '../../context/useWallet';
import { generateClientSeed, generateServerSeed, generateRandomNumber, generateHash } from '../../utils/provablyFair';
import { Bomb, Gem } from 'lucide-react';

const GRID_SIZE = 25; // 5x5 grid

const Mines: React.FC = () => {
  const { placeBet, addWinnings } = useWallet();
  const [betAmount, setBetAmount] = useState('10');
  const [mineCount, setMineCount] = useState(3);
  const [gameActive, setGameActive] = useState(false);
  const [revealedTiles, setRevealedTiles] = useState<Set<number>>(new Set());
  const [minePositions, setMinePositions] = useState<Set<number>>(new Set());
  const [multiplier, setMultiplier] = useState(1);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [clientSeed, setClientSeed] = useState('');
  const [serverSeed, setServerSeed] = useState('');

  const calculateMultiplier = (revealed: number, mines: number) => {
    const safeTiles = GRID_SIZE - mines;
    const multiplier = Math.pow(safeTiles / (safeTiles - revealed), revealed);
    return multiplier;
  };

  const startGame = () => {
    const bet = parseFloat(betAmount);
    if (isNaN(bet) || bet <= 0) {
      setMessage('Invalid bet amount');
      return;
    }

    if (!placeBet(bet, 'Mines')) {
      setMessage('Insufficient balance');
      return;
    }

    // Generate seeds for provably fair
    const client = generateClientSeed();
    const server = generateServerSeed();
    setClientSeed(client);
    setServerSeed(server);

    // Generate mine positions
    const mines = new Set<number>();
    let nonce = 0;
    while (mines.size < mineCount) {
      const position = generateRandomNumber(client, server, nonce++, 0, GRID_SIZE - 1);
      mines.add(position);
    }

    setMinePositions(mines);
    setRevealedTiles(new Set());
    setGameActive(true);
    setGameOver(false);
    setMultiplier(1);
    setMessage('');
  };

  const revealTile = (index: number) => {
    if (!gameActive || revealedTiles.has(index) || gameOver) return;

    const newRevealed = new Set(revealedTiles);
    newRevealed.add(index);
    setRevealedTiles(newRevealed);

    if (minePositions.has(index)) {
      // Hit a mine - game over
      setGameOver(true);
      setGameActive(false);
      setMessage('💥 BOOM! You hit a mine!');
      // Reveal all mines
      setTimeout(() => {
        setRevealedTiles(new Set([...Array(GRID_SIZE)].map((_, i) => i)));
      }, 500);
    } else {
      // Safe tile
      const newMultiplier = calculateMultiplier(newRevealed.size, mineCount);
      setMultiplier(newMultiplier);
      
      // Check if won (all safe tiles revealed)
      if (newRevealed.size === GRID_SIZE - mineCount) {
        cashout();
      }
    }
  };

  const cashout = () => {
    if (!gameActive || gameOver) return;

    const bet = parseFloat(betAmount);
    const winnings = bet * multiplier;
    addWinnings(winnings, 'Mines');
    
    setGameActive(false);
    setMessage(`🎉 You won $${winnings.toFixed(2)}!`);
    setGameOver(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">💣 Mines</h1>
        <p className="text-gray-400">Reveal safe tiles and avoid the mines</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="card space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Bet Amount</label>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              disabled={gameActive}
              className="input-field w-full"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Number of Mines ({mineCount})</label>
            <input
              type="range"
              value={mineCount}
              onChange={(e) => setMineCount(parseInt(e.target.value))}
              disabled={gameActive}
              min="1"
              max="20"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1</span>
              <span>20</span>
            </div>
          </div>

          {!gameActive ? (
            <button onClick={startGame} className="btn-primary w-full">
              Start Game
            </button>
          ) : (
            <button 
              onClick={cashout} 
              className="btn-primary w-full bg-casino-success hover:bg-casino-success/90"
              disabled={revealedTiles.size === 0 || gameOver}
            >
              Cashout ${(parseFloat(betAmount) * multiplier).toFixed(2)}
            </button>
          )}

          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-casino-accent/20 rounded-lg">
              <span className="text-gray-400">Multiplier:</span>
              <span className="font-bold text-casino-gold">{multiplier.toFixed(2)}x</span>
            </div>
            <div className="flex justify-between p-3 bg-casino-accent/20 rounded-lg">
              <span className="text-gray-400">Revealed:</span>
              <span className="font-bold">{revealedTiles.size}/{GRID_SIZE - mineCount}</span>
            </div>
          </div>

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

        {/* Game Grid */}
        <div className="lg:col-span-2 card">
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {[...Array(GRID_SIZE)].map((_, index) => {
              const isRevealed = revealedTiles.has(index);
              const isMine = minePositions.has(index);
              const showContent = isRevealed && (gameOver || !gameActive);

              return (
                <button
                  key={index}
                  onClick={() => revealTile(index)}
                  disabled={!gameActive || isRevealed || gameOver}
                  className={`aspect-square rounded-lg text-2xl sm:text-3xl font-bold transition-all duration-200 ${
                    isRevealed
                      ? isMine
                        ? 'bg-casino-danger text-white'
                        : 'bg-casino-success text-white'
                      : 'bg-casino-accent hover:bg-casino-accent/80 hover:scale-105'
                  } ${!gameActive || gameOver ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {showContent && (
                    <>
                      {isMine ? <Bomb className="w-full h-full p-2" /> : <Gem className="w-full h-full p-2" />}
                    </>
                  )}
                  {isRevealed && !showContent && !isMine && '💎'}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Provably Fair Info */}
      {gameOver && clientSeed && serverSeed && (
        <div className="card">
          <h3 className="font-bold mb-3">Provably Fair</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Client Seed:</span>
              <span className="font-mono text-xs">{clientSeed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Server Seed:</span>
              <span className="font-mono text-xs">{serverSeed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Result Hash:</span>
              <span className="font-mono text-xs">{generateHash(`${clientSeed}-${serverSeed}`)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mines;
