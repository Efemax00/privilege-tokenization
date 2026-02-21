'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@/context/WalletContext';
import { LogOut, User } from 'lucide-react';

export default function Navigation({
  isConnected,
  onConnect,
  onDisconnect,
}: {
  isConnected: boolean;
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
}) {
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { walletAddress } = useWallet();

  // Generate avatar from address
  const getAvatarColor = (address: string) => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'];
    const hash = address.charCodeAt(0) + address.charCodeAt(1);
    return colors[hash % colors.length];
  };

  return (
    <nav className="bg-black border-b border-yellow-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-lg">P</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:inline group-hover:text-yellow-500 transition">
              Privilege
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`transition ${
                pathname === '/'
                  ? 'text-yellow-500'
                  : 'text-gray-300 hover:text-yellow-500'
              }`}
            >
              Marketplace
            </Link>

            {isConnected && (
              <Link
                href="/profile"
                className={`transition ${
                  pathname === '/profile'
                    ? 'text-yellow-500'
                    : 'text-gray-300 hover:text-yellow-500'
                }`}
              >
                Profile
              </Link>
            )}

            {/* Wallet Button or Disconnect */}
            {!isConnected ? (
              <button
                onClick={onConnect}
                className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold py-2 px-6 rounded-lg transition"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 hover:opacity-80 transition"
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 ${getAvatarColor(walletAddress)} rounded-full flex items-center justify-center text-white font-bold cursor-pointer`}>
                    {walletAddress[0].toUpperCase()}
                  </div>
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-yellow-600 rounded-lg shadow-lg">
                    <div className="p-4 border-b border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${getAvatarColor(walletAddress)} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                          {walletAddress[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Connected Wallet</p>
                          <p className="text-yellow-500 font-mono text-xs font-semibold break-all">
                            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:bg-yellow-600 hover:text-black transition"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>

                    <button
                      onClick={() => {
                        onDisconnect();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 text-left px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right side: Mobile Avatar or Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {/* Mobile Avatar (only when connected) */}
            {isConnected && (
              <Link
                href="/profile"
                className={`md:hidden w-10 h-10 ${getAvatarColor(walletAddress)} rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-80 transition`}
              >
                {walletAddress[0].toUpperCase()}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden text-yellow-600 hover:text-yellow-500"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="md:hidden pb-4 border-t border-yellow-600">
            <Link
              href="/"
              className="block px-4 py-2 text-gray-300 hover:text-yellow-500 transition"
              onClick={() => setShowMenu(false)}
            >
              Marketplace
            </Link>

            {isConnected && (
              <>
                {/* Wallet Info in Mobile Menu */}

                {/* Disconnect Button in Mobile Menu */}
                <button
                  onClick={() => {
                    onDisconnect();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:text-red-500 transition flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Disconnect
                </button>
              </>
            )}

            {/* Connect Wallet Button (only when not connected) */}
            {!isConnected && (
              <div className="px-4 py-2">
                <button
                  onClick={() => {
                    onConnect();
                    setShowMenu(false);
                  }}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold py-2 px-6 rounded-lg transition"
                >
                  Connect Wallet
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}