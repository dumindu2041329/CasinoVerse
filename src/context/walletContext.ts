import { createContext } from 'react';
import type { WalletState } from '../types';

export const WalletContext = createContext<WalletState | undefined>(undefined);
