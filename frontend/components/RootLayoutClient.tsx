'use client';

import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { useWallet } from '@/context/WalletContext';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConnected, connectWallet, disconnectWallet } = useWallet();

  useEffect(() => {
    // Check if Xverse is available
    const checkXverse = () => {
      if (typeof window !== 'undefined') {
        console.log('🔍 Checking for Xverse...');
        console.log('window.xfi:', !!window.xfi);
        console.log('window.xfi.bitcoin:', !!window.xfi?.bitcoin);
        
        if (window.xfi?.bitcoin) {
          console.log('✅ Xverse Bitcoin detected!');
        } else {
          console.warn('⚠️ Xverse not found. Make sure it\'s installed.');
        }
      }
    };

    // Check immediately and after delay
    checkXverse();
    const timeout = setTimeout(checkXverse, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Navigation
        isConnected={isConnected}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
      />
      {children}
    </>
  );
}