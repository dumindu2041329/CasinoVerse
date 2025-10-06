export interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'bet' | 'win';
  amount: number;
  timestamp: Date;
  game?: string;
}

export interface GameResult {
  id: string;
  game: string;
  betAmount: number;
  multiplier: number;
  profit: number;
  timestamp: Date;
  provablyFairSeed: string;
}

export interface ProvablyFairData {
  clientSeed: string;
  serverSeed: string;
  nonce: number;
  hash: string;
}

export type GameType = 'mines' | 'dice' | 'plinko' | 'limbo' | 'keno' | 'crash' | 'roulette';

export interface GameHistory {
  results: GameResult[];
  addResult: (result: GameResult) => void;
  clearHistory: () => void;
}

export interface WalletState {
  balance: number;
  transactions: Transaction[];
  deposit: (amount: number) => void;
  withdraw: (amount: number) => boolean;
  placeBet: (amount: number, game: string) => boolean;
  addWinnings: (amount: number, game: string) => void;
}
