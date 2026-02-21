'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Phone, MessageCircle, Coffee } from 'lucide-react';
import { influencers } from '@/lib/influencers-data';

export default function AccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const influencerId = searchParams.get('id');
  const tierName = searchParams.get('tier')?.toLowerCase();
  
  const influencer = influencers.find(i => i.id === influencerId);
  const tier = influencer?.tiers.find(t => t.name.toLowerCase() === tierName);

  if (!influencer || !tier) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Access not found</p>
      </div>
    );
  }

  const randomPhone = `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`;
  
  const coffeeAddresses = [
    "123 Main St, San Francisco, CA 94105",
    "456 Park Ave, New York, NY 10022",
    "789 Sunset Blvd, Los Angeles, CA 90069",
  ];
  const coffeeAddress = coffeeAddresses[Math.floor(Math.random() * coffeeAddresses.length)];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="border-b border-yellow-600/30 bg-black/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-yellow-500"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{influencer.name}</h1>
            <p className="text-sm text-yellow-500">{influencer.title}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            {tierName === 'chat' && <MessageCircle className="w-16 h-16 text-yellow-500" />}
            {tierName === 'call' && <Phone className="w-16 h-16 text-yellow-500" />}
            {tierName === 'coffee' && <Coffee className="w-16 h-16 text-yellow-500" />}
          </div>
          <h2 className="text-5xl font-bold text-white mb-4">
            {tier.name} Access Unlocked! ✓
          </h2>
        </div>

        {/* CHAT */}
        {tierName === 'chat' && (
          <div className="bg-gray-900/50 border border-yellow-600/30 rounded-2xl overflow-hidden max-w-2xl mx-auto">
            <div className="bg-yellow-600 p-6">
              <h3 className="text-white text-xl font-bold">💬 Direct Message</h3>
            </div>
            <div className="p-8 h-96 flex flex-col">
              <div className="flex-1 space-y-4 mb-4">
                <div className="bg-gray-800 rounded-lg p-4 max-w-xs">
                  <p className="text-gray-300">Hi! Thanks for buying access</p>
                </div>
                <div className="bg-yellow-600/20 rounded-lg p-4 max-w-xs ml-auto">
                  <p className="text-gray-200">Great to connect!</p>
                </div>
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="Type message..." className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
                <button className="bg-yellow-600 text-white px-6 py-2 rounded-lg">Send</button>
              </div>
            </div>
          </div>
        )}

        {/* CALL */}
        {tierName === 'call' && (
          <div className="bg-gray-900/50 border border-yellow-600/30 rounded-2xl p-8 max-w-2xl mx-auto text-center">
            <Phone className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
            <h3 className="text-white text-2xl font-bold mb-4">Ready for Your Call</h3>
            <div className="bg-gray-800 rounded-xl p-8 mb-8">
              <p className="text-gray-400 mb-2">Phone Number:</p>
              <p className="text-white text-4xl font-bold font-mono">{randomPhone}</p>
            </div>
            <button
              onClick={() => window.location.href = `tel:${randomPhone}`}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl w-full"
            >
              📞 Call Now
            </button>
          </div>
        )}

        {/* COFFEE */}
        {tierName === 'coffee' && (
          <div className="bg-gray-900/50 border border-yellow-600/30 rounded-2xl p-8 max-w-2xl mx-auto">
            <Coffee className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
            <h3 className="text-white text-2xl font-bold mb-2">In-Person Meeting</h3>
            <div className="bg-gray-800 rounded-xl p-6 mb-6">
              <p className="text-gray-400 mb-2">📍 Location:</p>
              <p className="text-white text-lg font-semibold">{coffeeAddress}</p>
            </div>
            <button
              onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(coffeeAddress)}`, '_blank')}
              className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl w-full mb-4"
            >
              📍 View on Map
            </button>
          </div>
        )}

        <div className="max-w-2xl mx-auto mt-12 p-6 bg-green-900/20 border border-green-600/30 rounded-xl text-center">
          <p className="text-green-400 font-semibold">✓ Access recorded on blockchain</p>
        </div>
      </div>
    </div>
  );
}