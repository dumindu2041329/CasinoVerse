import React, { useState } from 'react';
import { X, Plus, Minus, Clock } from 'lucide-react';
import { useWallet } from '../context/useWallet';

interface WalletModalProps {
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ onClose }) => {
  const { balance, transactions, deposit, withdraw } = useWallet();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    deposit(depositAmount);
    setAmount('');
    setError('');
    setActiveTab('history');
  };

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (withdrawAmount > balance) {
      setError('Insufficient balance');
      return;
    }
    const success = withdraw(withdrawAmount);
    if (success) {
      setAmount('');
      setError('');
      setActiveTab('history');
    } else {
      setError('Withdrawal failed');
    }
  };

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-casino-secondary rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-casino-accent/30">
          <h2 className="text-2xl font-bold">Wallet</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-casino-accent rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Balance Display */}
        <div className="p-6 bg-casino-accent/20">
          <div className="text-center">
            <p className="text-gray-400 mb-2">Current Balance</p>
            <p className="text-4xl font-bold text-casino-gold">${balance.toFixed(2)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-casino-accent/30">
          <button
            onClick={() => { setActiveTab('deposit'); setError(''); }}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'deposit'
                ? 'bg-casino-accent text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Plus className="inline w-5 h-5 mr-2" />
            Deposit
          </button>
          <button
            onClick={() => { setActiveTab('withdraw'); setError(''); }}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'withdraw'
                ? 'bg-casino-accent text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Minus className="inline w-5 h-5 mr-2" />
            Withdraw
          </button>
          <button
            onClick={() => { setActiveTab('history'); setError(''); }}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'history'
                ? 'bg-casino-accent text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Clock className="inline w-5 h-5 mr-2" />
            History
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {(activeTab === 'deposit' || activeTab === 'withdraw') && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="input-field w-full"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <p className="text-sm font-medium mb-3">Quick Amount</p>
                <div className="grid grid-cols-3 gap-3">
                  {quickAmounts.map((quickAmount) => (
                    <button
                      key={quickAmount}
                      onClick={() => setAmount(quickAmount.toString())}
                      className="bg-casino-accent hover:bg-casino-accent/80 py-3 rounded-lg font-semibold transition-colors"
                    >
                      ${quickAmount}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-casino-danger/20 border border-casino-danger text-casino-danger px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                onClick={activeTab === 'deposit' ? handleDeposit : handleWithdraw}
                className="btn-primary w-full"
              >
                {activeTab === 'deposit' ? 'Deposit' : 'Withdraw'}
              </button>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No transactions yet</p>
              ) : (
                transactions.slice(0, 20).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-casino-accent/20 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'deposit' || transaction.type === 'win'
                            ? 'bg-casino-success/20 text-casino-success'
                            : 'bg-casino-danger/20 text-casino-danger'
                        }`}
                      >
                        {transaction.type === 'deposit' || transaction.type === 'win' ? (
                          <Plus className="w-5 h-5" />
                        ) : (
                          <Minus className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold capitalize">{transaction.type}</p>
                        <p className="text-sm text-gray-400">
                          {transaction.game && `${transaction.game} • `}
                          {new Date(transaction.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`font-bold ${
                        transaction.type === 'deposit' || transaction.type === 'win'
                          ? 'text-casino-success'
                          : 'text-casino-danger'
                      }`}
                    >
                      {transaction.type === 'deposit' || transaction.type === 'win' ? '+' : '-'}$
                      {transaction.amount.toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
