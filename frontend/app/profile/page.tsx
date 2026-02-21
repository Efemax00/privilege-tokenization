'use client';

import { useState, useEffect, SetStateAction } from 'react';
import { useWallet } from '@/context/WalletContext';
import { usePrivilegeContract } from '@/hooks/usePrivilegeContract';
import { Copy, LogOut, TrendingUp, Lock, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { influencers } from '@/lib/influencers-data';

export default function ProfilePage() {
  const { isConnected, walletAddress, disconnectWallet } = useWallet();
  const { buyAccess } = usePrivilegeContract();
  const [btcBalance, setBtcBalance] = useState('0.0000');
  const [usdValue, setUsdValue] = useState('0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [purchasedAccess, setPurchasedAccess] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (isConnected && walletAddress) {
      fetchBitcoinBalance();
      loadPurchasedAccess();
      loadTransactions();
    } else {
      setLoading(false);
    }
  }, [isConnected, walletAddress]);

  const fetchBitcoinBalance = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://mempool.staging.midl.xyz/api/address/${walletAddress}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch balance');
      }

      const data = await response.json();
      
      const confirmedBTC = (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 100000000;
      const unconfirmedBTC = (data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum) / 100000000;
      const totalBTC = confirmedBTC + unconfirmedBTC;

      setBtcBalance(totalBTC.toFixed(8));
      
      const btcPriceUSD = 45000;
      setUsdValue((totalBTC * btcPriceUSD).toFixed(2));
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError('Unable to fetch balance.');
      setLoading(false);
      setBtcBalance('0.0000');
      setUsdValue('0');
    }
  };

  const loadPurchasedAccess = () => {
    try {
      const access: SetStateAction<any[]> = [];
      
      influencers.forEach(influencer => {
        influencer.tiers.forEach((tier, tierIdx) => {
          const accessKey = `access_${walletAddress}_${influencer.id}`;
          const txId = localStorage.getItem(accessKey);
          
          if (txId) {
            access.push({
              influencerId: influencer.id,
              influencerName: influencer.name,
              influencerTitle: influencer.title,
              tier: tier.name,
              tierIndex: tierIdx,
              txId: txId,
              purchasedAt: new Date().toLocaleDateString(),
            });
          }
        });
      });
      
      setPurchasedAccess(access);
    } catch (err) {
      console.error('Error loading purchases:', err);
    }
  };

  const loadTransactions = () => {
    try {
      const allTxs: SetStateAction<any[]> = [];
      
      influencers.forEach(influencer => {
        influencer.tiers.forEach(tier => {
          const accessKey = `access_${walletAddress}_${influencer.id}`;
          const txId = localStorage.getItem(accessKey);
          
          if (txId) {
            allTxs.push({
              txId: txId,
              type: 'Access Purchase',
              amount: (tier.price / 100000000).toFixed(8),
              influencer: influencer.name,
              tier: tier.name,
              status: 'Confirmed',
              date: new Date().toLocaleDateString(),
            });
          }
        });
      });
      
      setTransactions(allTxs);
    } catch (err) {
      console.error('Error loading transactions:', err);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-yellow-500" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-8">
            You need to connect your wallet to view your profile and assets.
          </p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-3 px-8 rounded-xl transition-all"
          >
            Go to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your wallet and access privileges</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Wallet Info */}
          <div className="lg:col-span-1">
            {/* Wallet Card */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-600/30 rounded-3xl p-8 mb-8 shadow-2xl shadow-yellow-600/20">
              <h2 className="text-2xl font-bold text-white mb-6">Your Wallet</h2>

              {/* Address */}
              <div className="mb-8">
                <label className="text-gray-400 text-sm block mb-2">Wallet Address</label>
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex items-center justify-between group hover:border-yellow-600/50 transition">
                  <code className="text-yellow-500 font-mono text-sm break-all">
                    {walletAddress.slice(0, 12)}...{walletAddress.slice(-8)}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="ml-2 text-gray-400 hover:text-yellow-500 transition flex-shrink-0"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {copiedAddress && (
                  <p className="text-green-400 text-xs mt-2">✓ Copied to clipboard</p>
                )}
              </div>

              {/* Bitcoin Balance */}
              <div className="mb-8">
                <label className="text-gray-400 text-sm block mb-2">BTC Balance (Midl Regtest)</label>
                <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 border border-yellow-600/30 rounded-xl p-6">
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="h-8 bg-gray-700 rounded w-24 mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded w-20"></div>
                    </div>
                  ) : error ? (
                    <div className="flex gap-3 items-start">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-4xl font-black text-yellow-400">
                        {btcBalance}
                        <span className="text-lg ml-2">BTC</span>
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        ≈ ${usdValue} USD
                      </p>
                    </>
                  )}
                </div>
                <button
                  onClick={() => {
                    fetchBitcoinBalance();
                    loadPurchasedAccess();
                    loadTransactions();
                  }}
                  disabled={loading}
                  className="text-gray-500 hover:text-yellow-500 text-xs mt-2 transition disabled:opacity-50"
                >
                  {loading ? 'Refreshing...' : 'Refresh Balance'}
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-gray-400 text-xs mb-1">Purchases</p>
                  <p className="text-white font-bold">{purchasedAccess.length}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-gray-400 text-xs mb-1">Status</p>
                  <p className="text-green-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Connected
                  </p>
                </div>
              </div>

              {/* Disconnect Button */}
              <button
                onClick={disconnectWallet}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Disconnect Wallet
              </button>
            </div>

            {/* Security Info */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Security Tips
              </h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex gap-2">
                  <span className="text-yellow-500">•</span>
                  <span>Never share your seed phrase</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-yellow-500">•</span>
                  <span>Keep your private keys secure</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-yellow-500">•</span>
                  <span>Verify all transactions carefully</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Access & Transactions */}
          <div className="lg:col-span-2">
            {/* Access Privileges */}
            <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Your Access Privileges</h2>
              
              {purchasedAccess.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-yellow-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-yellow-500" />
                  </div>
                  <p className="text-gray-400 mb-6">
                    You haven't purchased any access privileges yet.
                  </p>
                  <Link
                    href="/"
                    className="inline-block bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-3 px-8 rounded-xl transition-all"
                  >
                    Browse Influencers
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchasedAccess.map((access, idx) => (
                    <div key={idx} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 hover:border-yellow-600/50 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <h3 className="text-white font-bold">{access.influencerName}</h3>
                          </div>
                          <p className="text-yellow-500 text-sm mb-2">{access.influencerTitle}</p>
                          <p className="text-gray-400 text-sm mb-3">{access.tier} Access</p>
                          <p className="text-gray-500 text-xs font-mono">{access.txId.slice(0, 16)}...</p>
                        </div>
                        <Link
                          href={`/access?id=${access.influencerId}&tier=${access.tier}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
                        >
                          Open Access
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Transaction History */}
            <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Transactions</h2>

              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-gray-500" />
                  </div>
                  <p className="text-gray-400">
                    No transactions yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((tx, idx) => (
                    <div key={idx} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 flex items-center justify-between hover:border-yellow-600/50 transition">
                      <div className="flex-1">
                        <p className="text-white font-bold text-sm">{tx.type}</p>
                        <p className="text-gray-400 text-xs mt-1">{tx.influencer} - {tx.tier}</p>
                        <p className="text-gray-500 text-xs mt-1 font-mono">{tx.txId.slice(0, 16)}...</p>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-400 font-bold">{tx.amount} BTC</p>
                        <span className="inline-block bg-green-600/20 text-green-400 text-xs px-3 py-1 rounded-full mt-2">
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}