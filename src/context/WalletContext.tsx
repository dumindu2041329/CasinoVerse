import React, { useState, useEffect, type ReactNode } from 'react';
import type { Transaction, WalletState } from '../types';
import { WalletContext } from './wallet-context';
import { useAuth } from './useAuth';



interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Load wallet data from localStorage
      const walletKey = `wallet_${user.id}`;
      const storedWallet = localStorage.getItem(walletKey);
      
      if (storedWallet) {
        const walletData = JSON.parse(storedWallet);
        setBalance(walletData.balance);
        setTransactions(walletData.transactions.map((t: Transaction) => ({
          ...t,
          timestamp: new Date(t.timestamp)
        })));
      } else {
        setBalance(user.balance);
        setTransactions([]);
      }
    } else {
      setBalance(0);
      setTransactions([]);
    }
  }, [user, isAuthenticated]);

  const saveWallet = (newBalance: number, newTransactions: Transaction[]) => {
    if (user) {
      const walletKey = `wallet_${user.id}`;
      localStorage.setItem(walletKey, JSON.stringify({
        balance: newBalance,
        transactions: newTransactions
      }));
    }
  };

  const deposit = (amount: number) => {
    const newBalance = balance + amount;
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'deposit',
      amount,
      timestamp: new Date(),
    };
    
    const newTransactions = [newTransaction, ...transactions];
    setBalance(newBalance);
    setTransactions(newTransactions);
    saveWallet(newBalance, newTransactions);
  };

  const withdraw = (amount: number): boolean => {
    if (amount > balance) {
      return false;
    }
    
    const newBalance = balance - amount;
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'withdraw',
      amount,
      timestamp: new Date(),
    };
    
    const newTransactions = [newTransaction, ...transactions];
    setBalance(newBalance);
    setTransactions(newTransactions);
    saveWallet(newBalance, newTransactions);
    return true;
  };

  const placeBet = (amount: number, game: string): boolean => {
    if (amount > balance) {
      return false;
    }
    
    const newBalance = balance - amount;
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'bet',
      amount,
      timestamp: new Date(),
      game,
    };
    
    const newTransactions = [newTransaction, ...transactions];
    setBalance(newBalance);
    setTransactions(newTransactions);
    saveWallet(newBalance, newTransactions);
    return true;
  };

  const addWinnings = (amount: number, game: string) => {
    const newBalance = balance + amount;
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'win',
      amount,
      timestamp: new Date(),
      game,
    };
    
    const newTransactions = [newTransaction, ...transactions];
    setBalance(newBalance);
    setTransactions(newTransactions);
    saveWallet(newBalance, newTransactions);
  };

  const value: WalletState = {
    balance,
    transactions,
    deposit,
    withdraw,
    placeBet,
    addWinnings,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};
