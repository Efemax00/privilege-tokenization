'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string;
  wallet: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [wallet, setWallet] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      const { getAddress, AddressPurpose, BitcoinNetworkType } = await import(
        'sats-connect'
      );

      await getAddress({
        payload: {
          purposes: [AddressPurpose.Payment],
          message: 'Connect to Privilege',
          network: {
            type: BitcoinNetworkType.Regtest,
          },
        },
        onFinish: (response: any) => {
          const address = response.addresses?.[0]?.address;
          if (address) {
            setWalletAddress(address);
            setWallet(address); // Store wallet address
            setIsConnected(true);
            console.log('✅ Wallet connected:', address);
          }
        },
        onCancel: () => {
          console.log('User cancelled wallet connection');
        },
      });
    } catch (error) {
      console.error('Connection failed:', error);
      alert('Make sure Xverse is installed and on Regtest network');
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setWallet(null);
    console.log('✅ Wallet disconnected');
  };

  return (
    <WalletContext.Provider
      value={{ isConnected, walletAddress, wallet, connectWallet, disconnectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}