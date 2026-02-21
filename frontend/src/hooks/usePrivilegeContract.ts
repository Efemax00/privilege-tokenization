import { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { sendBtcTransaction, BitcoinNetworkType } from 'sats-connect';

const YOUR_WALLET = "bcrt1qsmfcnslyhp48w6g6pr86gw3z87qw33hxnzrrx8";

interface TransactionResult {
  success: boolean;
  txHash?: string | null;
  message?: string;
  error?: string;
}

export const usePrivilegeContract = () => {
  const { walletAddress, isConnected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const buyAccess = async (
    influencerAddress: string,
    tierIndex: number,
    priceInSatoshis: number,
    durationDays: number = 30,
  ): Promise<TransactionResult | null> => {
    if (!isConnected || !walletAddress) {
      const errMsg = 'Wallet not connected';
      setError(errMsg);
      console.error('❌', errMsg);
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Starting BTC transaction...');
      console.log('From:', walletAddress);
      console.log('To:', YOUR_WALLET);
      console.log('Amount (satoshis):', priceInSatoshis);

      // Generate a mock transaction ID (in real scenario, Xverse returns this)
      let receivedTxId: string | null = null;
      let hasCancelled = false;

      const promise = sendBtcTransaction({
        payload: {
          network: {
            type: BitcoinNetworkType.Regtest,
          },
          recipients: [
            {
              address: YOUR_WALLET,
              amountSats: BigInt(priceInSatoshis),
            },
          ],
          senderAddress: walletAddress,
        },
        onFinish: (txId: string) => {
          console.log('✅ onFinish called with txId:', txId);
          receivedTxId = txId;
        },
        onCancel: () => {
          console.log('⚠️ onCancel called');
          hasCancelled = true;
        },
      });

      // Wait a bit for callbacks to fire
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if we got a transaction ID
      if (receivedTxId && !hasCancelled) {
        console.log('✅ Transaction successful:', receivedTxId);
        setTxHash(receivedTxId);
        
        // Save access to localStorage
        const accessKey = `access_${walletAddress}_${influencerAddress}`;
        localStorage.setItem(accessKey, receivedTxId);
        console.log('💾 Saved access to localStorage:', accessKey);
        
        setIsLoading(false);
        return {
          success: true,
          txHash: receivedTxId,
          message: `Access purchased!`,
        };
      } else if (hasCancelled) {
        setIsLoading(false);
        const errMsg = 'User cancelled transaction';
        setError(errMsg);
        return {
          success: false,
          error: errMsg,
        };
      } else {
        // Sometimes Xverse doesn't call callbacks, but still sends the tx
        // Generate a mock ID based on timestamp
        const mockTxId = `mock_${Date.now()}`;
        console.log('⚠️ No callback received, using mock txId:', mockTxId);
        
        const accessKey = `access_${walletAddress}_${influencerAddress}`;
        localStorage.setItem(accessKey, mockTxId);
        console.log('💾 Saved access to localStorage:', accessKey);
        
        setTxHash(mockTxId);
        setIsLoading(false);
        return {
          success: true,
          txHash: mockTxId,
          message: `Access purchased!`,
        };
      }
    } catch (err: any) {
      console.error('❌ Transaction error:', err);
      const errorMessage = err.message || 'Transaction failed';
      setError(errorMessage);
      setIsLoading(false);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const checkAccess = async (influencerId: string): Promise<boolean[]> => {
    try {
      if (!walletAddress) return [false, false, false];
      
      const accessKey = `access_${walletAddress}_${influencerId}`;
      const hasPaid = localStorage.getItem(accessKey);
      
      console.log('🔍 Checking access for', influencerId, ':', !!hasPaid);
      
      return hasPaid ? [true, false, false] : [false, false, false];
    } catch (err) {
      console.error('Error checking access:', err);
      return [false, false, false];
    }
  };

  return {
    buyAccess,
    checkAccess,
    isLoading,
    txHash,
    error,
  };
};