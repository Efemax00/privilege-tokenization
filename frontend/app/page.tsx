"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Star,
  Users,
  MessageCircle,
  Phone,
  Coffee,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Lock,
  Zap,
  ChevronLeft,
} from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { influencers } from "@/lib/influencers-data";
import { usePrivilegeContract } from "@/hooks/usePrivilegeContract";
import { useRouter } from "next/navigation";

export default function Marketplace() {
  const { isConnected, walletAddress } = useWallet();
  const [celebrities] = useState(influencers);
  const [searchTerm, setSearchTerm] = useState("");
  const { buyAccess, checkAccess, isLoading } = usePrivilegeContract();
  const [userAccess, setUserAccess] = useState<{ [key: string]: boolean[] }>(
    {},
  );
  const [selectedCelebrity, setSelectedCelebrity] = useState<
    (typeof influencers)[0] | null
  >(null);
  const router = useRouter();

  const [pending, setPending] = useState<{
    influencerId: string;
    tierIndex: number;
  } | null>(null);

  const filteredCelebrities = influencers.filter((celebrity) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      celebrity.name.toLowerCase().includes(searchLower) ||
      celebrity.title.toLowerCase().includes(searchLower) ||
      celebrity.bio.toLowerCase().includes(searchLower)
    );
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const formatPrice = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(0) + "M tokens";
    if (num >= 1000) return (num / 1000).toFixed(0) + "K tokens";
    return num + " tokens";
  };

  useEffect(() => {
    console.log("🔍 Checking Xverse...");
    console.log(
      "window.xfi exists?",
      typeof window !== "undefined" && !!window.xfi,
    );
    console.log(
      "window.xfi.bitcoin exists?",
      typeof window !== "undefined" && !!window.xfi?.bitcoin,
    );

    if (!window.xfi) {
      console.warn("⚠️ Xverse not found. Is it installed?");
    }
  }, []);

  useEffect(() => {
    if (isConnected && selectedCelebrity && walletAddress) {
      checkUserAccess(selectedCelebrity.id);
    }
  }, [isConnected, selectedCelebrity?.id, walletAddress]);

  const checkUserAccess = async (influencerId: string) => {
    const access = await checkAccess(influencerId);
    setUserAccess((prev) => ({
      ...prev,
      [influencerId]: access,
    }));
  };

  const handleBuyAccess = async (
    tierName: string,
    tierPrice: number,
    influencerId: string,
    tierIndex: number,
  ) => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      const result = await buyAccess(influencerId, tierIndex, tierPrice);

      if (result?.success) {
        alert(
          `✅ Transaction confirmed!\nTX: ${result.txHash?.slice(0, 20)}...\n\nRedirecting to your access page...`,
        );
        setSelectedCelebrity(null);
        router.push(
          `/access?id=${influencerId}&tier=${tierName.toLowerCase()}`,
        );
      } else {
        alert(`❌ Transaction failed: ${result?.error ?? "Unknown error"}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="border-b border-yellow-600/30 py-20 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-yellow-600/10 border border-yellow-600/30 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-semibold text-yellow-500">
                Tokenized Access to Influence
              </span>
            </div>
            <h1 className="text-6xl sm:text-7xl font-black text-white mb-6 leading-tight">
              Connect With <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600">
                Crypto Leadership
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Buy privilege tokens to unlock exclusive access to the world's
              most influential crypto leaders. Direct communication, private
              calls, and in-person meetings—all secured on blockchain.
            </p>
          </div>

          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, title, or bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900/50 border border-yellow-600/30 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 backdrop-blur transition"
            />
          </div>
        </div>
      </section>

      {/* What is Privilege Section */}
      <section className="py-20 sm:py-32 border-b border-yellow-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              What is Privilege?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A revolutionary blockchain platform that tokenizes access to
              influential figures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-8 hover:border-yellow-600/50 transition-all backdrop-blur-sm">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Tokenized Access
              </h3>
              <p className="text-gray-400">
                Purchase privilege tokens to unlock different tiers of
                access—from direct messaging to private meetings with industry
                leaders.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-8 hover:border-yellow-600/50 transition-all backdrop-blur-sm">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Blockchain Verified
              </h3>
              <p className="text-gray-400">
                All transactions are recorded immutably on the Midl Bitcoin
                testnet. Complete transparency and security for every
                interaction.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-8 hover:border-yellow-600/50 transition-all backdrop-blur-sm">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Fair Market Value
              </h3>
              <p className="text-gray-400">
                Each influencer sets their own token prices based on demand.
                Market dynamics ensure fair pricing for both parties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Celebrity Grid */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Featured Influencers
            </h2>
            <p className="text-xl text-gray-400">
              {filteredCelebrities.length === 0
                ? "No matches found"
                : `Showing ${filteredCelebrities.length} of ${celebrities.length} influencers`}
            </p>
          </div>

          {filteredCelebrities.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">
                No influencers found matching "{searchTerm}"
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCelebrities.map((celebrity) => (
                <div
                  key={celebrity.id}
                  className="group relative bg-gray-900/50 border border-gray-800/50 rounded-2xl overflow-hidden hover:border-yellow-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-600/20 backdrop-blur-sm"
                >
                  <div className="relative h-80 overflow-hidden bg-gray-800">
                    <img
                      src={celebrity.image}
                      alt={celebrity.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/400x400?text=" +
                          encodeURIComponent(celebrity.name);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent group-hover:via-black/20 transition-all duration-300" />

                    {celebrity.verified && (
                      <div className="absolute top-4 right-4 bg-yellow-600 text-black rounded-full p-2 shadow-lg">
                        <Star className="w-5 h-5 fill-current" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="text-2xl font-bold text-white group-hover:text-yellow-400 transition">
                        {celebrity.name}
                      </h3>
                      <p className="text-sm text-yellow-500 font-semibold">
                        {celebrity.title}
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        {celebrity.bio}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mb-6 text-gray-300 text-sm">
                      <Users className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold">
                        {formatNumber(celebrity.followers)}
                      </span>
                      <span>followers</span>
                    </div>

                    <button
                      onClick={() => setSelectedCelebrity(celebrity)}
                      className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-3 rounded-xl transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-yellow-600/50"
                    >
                      View Profile
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 sm:py-32 border-b border-yellow-600/20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              Get started in 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Connect Wallet",
                description:
                  "Link your Xverse wallet with Bitcoin testnet funds",
              },
              {
                step: "2",
                title: "Browse Influencers",
                description:
                  "Explore and search for crypto leaders you want to access",
              },
              {
                step: "3",
                title: "Choose Access Tier",
                description:
                  "Select from Chat, Call, or Coffee meeting options",
              },
              {
                step: "4",
                title: "Complete Transaction",
                description: "Buy tokens and get instant access on blockchain",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-black border border-gray-800 rounded-2xl p-8 hover:border-yellow-600/50 transition-all h-full">
                  <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-full flex items-center justify-center border-2 border-black">
                    <span className="text-white font-black text-lg">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-4 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-yellow-600/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 sm:py-32 border-b border-yellow-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Why Choose Privilege?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🔐",
                title: "Secure & Transparent",
                description: "All transactions on blockchain, fully verifiable",
              },
              {
                icon: "⚡",
                title: "Instant Access",
                description: "Get immediate access after purchase",
              },
              {
                icon: "💰",
                title: "Fair Pricing",
                description: "Market-driven prices set by influencers",
              },
              {
                icon: "🌍",
                title: "Global Network",
                description: "Connect with leaders from anywhere",
              },
              {
                icon: "✅",
                title: "Verified Influencers",
                description: "Only authentic, verified crypto leaders",
              },
              {
                icon: "🚀",
                title: "Web3 Native",
                description: "Built for the decentralized future",
              },
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-8 hover:border-yellow-600/50 transition-all hover:shadow-xl hover:shadow-yellow-600/20 backdrop-blur-sm"
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Side Panel for Profile */}
      {selectedCelebrity && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setSelectedCelebrity(null)}
          />

          {/* Slide-out Panel */}
          <div className="fixed right-0 top-0 h-screen w-full sm:w-96 bg-gradient-to-b from-gray-900 to-black border-l border-yellow-600/30 shadow-2xl shadow-yellow-600/20 z-50 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-black/80 backdrop-blur-sm border-b border-yellow-600/30 p-4 flex items-center justify-between">
              <button
                onClick={() => setSelectedCelebrity(null)}
                className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition font-semibold"
              >
                <ChevronLeft className="w-5 h-5" />
                Go Back
              </button>
              <button
                onClick={() => setSelectedCelebrity(null)}
                className="text-gray-400 hover:text-white transition text-2xl w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <img
                  src={selectedCelebrity.image}
                  alt={selectedCelebrity.name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-yellow-600 shadow-lg mx-auto mb-4"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/200x200?text=" +
                      encodeURIComponent(selectedCelebrity.name);
                  }}
                />
                <div className="flex items-center gap-2 justify-center mb-2">
                  <h2 className="text-2xl font-bold text-white">
                    {selectedCelebrity.name}
                  </h2>
                  {selectedCelebrity.verified && (
                    <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  )}
                </div>
                <p className="text-yellow-500 font-bold mb-2">
                  {selectedCelebrity.title}
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  {selectedCelebrity.bio}
                </p>
                <div className="flex items-center gap-2 text-gray-300 justify-center text-sm">
                  <Users className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold">
                    {formatNumber(selectedCelebrity.followers)}
                  </span>
                  <span>followers</span>
                </div>
              </div>

              <div
                className={`mb-6 p-3 rounded-xl border text-center ${
                  isConnected
                    ? "bg-green-900/20 border-green-600/30"
                    : "bg-yellow-900/20 border-yellow-600/30"
                }`}
              >
                <p
                  className={`text-xs font-semibold ${
                    isConnected ? "text-green-400" : "text-yellow-400"
                  }`}
                >
                  {isConnected
                    ? "✓ Wallet Connected - Ready to purchase"
                    : "⚠ Connect Wallet to Buy Access"}
                </p>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Access Tiers
                </h3>

                {!isConnected ? (
                  <div className="text-center py-6">
                    <p className="text-gray-400 text-sm">
                      Connect your wallet to unlock exclusive access
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedCelebrity.tiers.map((tier, idx) => {
                      const isThisPending =
                        pending?.influencerId === selectedCelebrity.id &&
                        pending?.tierIndex === idx;
                      const hasAccess = userAccess[selectedCelebrity.id]?.[idx];
                      const iconMap: { [key: string]: React.ReactNode } = {
                        Chat: <MessageCircle className="w-4 h-4" />,
                        Call: <Phone className="w-4 h-4" />,
                        Coffee: <Coffee className="w-4 h-4" />,
                      };

                      return (
                        <div
                          key={idx}
                          className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 hover:border-yellow-600/50 transition-all"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-yellow-500">
                              {iconMap[tier.name]}
                            </div>
                            <h4 className="font-bold text-white text-sm">
                              {tier.name}
                            </h4>
                            <span className="text-xs text-yellow-400 font-bold ml-auto">
                              {formatPrice(tier.price)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mb-3">
                            {tier.description}
                          </p>

                          {hasAccess ? (
                            // User already has access
                            <button
                              onClick={() => {
                                // Navigate to access page
                                window.location.href = `/access?id=${selectedCelebrity.id}&tier=${tier.name.toLowerCase()}`;
                              }}
                              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-2 rounded-lg transition-all text-xs"
                            >
                              ✓ Access Unlocked - Open
                            </button>
                          ) : (
                            // User needs to buy
                            <button
                              onClick={() =>
                                handleBuyAccess(
                                  tier.name,
                                  tier.price,
                                  selectedCelebrity.id,
                                  idx,
                                )
                              }
                              disabled={!!pending}
                              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-2 rounded-lg transition-all text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isThisPending ? "Processing..." : "Buy Now"}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <footer className="border-t border-yellow-600/20 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold">P</span>
                </div>
                <span className="text-white font-bold text-xl">Privilege</span>
              </div>
              <p className="text-gray-400 text-sm">
                Tokenized access to the world's most influential crypto leaders,
                secured on Bitcoin blockchain.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="/" className="hover:text-yellow-500 transition">
                    Marketplace
                  </a>
                </li>
                <li>
                  <a
                    href="/profile"
                    className="hover:text-yellow-500 transition"
                  >
                    My Profile
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-500 transition">
                    Become Influencer
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-yellow-500 transition">
                    Docs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-500 transition">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-500 transition">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-yellow-500 transition">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-500 transition">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-500 transition">
                    Telegram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                &copy; 2026 Privilege. All transactions secured on Midl Bitcoin
                testnet.
              </p>
              <div className="flex gap-6 mt-4 md:mt-0 text-sm text-gray-400">
                <a href="#" className="hover:text-yellow-500 transition">
                  Privacy
                </a>
                <a href="#" className="hover:text-yellow-500 transition">
                  Terms
                </a>
                <a href="#" className="hover:text-yellow-500 transition">
                  Security
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
