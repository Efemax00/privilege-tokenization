import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { sendBtcTransaction, BitcoinNetworkType } from "sats-connect";

const YOUR_WALLET = "bcrt1qsmfcnslyhp48w6g6pr86gw3z87qw33hxnzrrx8";

interface TransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export const usePrivilegeContract = () => {
  const { walletAddress, isConnected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the latest unconfirmed (mempool) txs sent FROM walletAddress TO YOUR_WALLET
  const pollForTx = async (
    senderAddress: string,
    afterTimestamp: number,
    maxWaitMs = 30000,
    intervalMs = 2000,
  ): Promise<string | null> => {
    const deadline = Date.now() + maxWaitMs;

    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, intervalMs));

      try {
        // Get mempool txs for YOUR_WALLET (the recipient)
        const res = await fetch(
          `https://mempool.staging.midl.xyz/api/address/${YOUR_WALLET}/txs`,
        );
        if (!res.ok) continue;

        const txs: any[] = await res.json();

        for (const tx of txs) {
          const isFromSender = tx.vin?.some(
            (input: any) =>
              input.prevout?.scriptpubkey_address === senderAddress,
          );

          // Only accept TX that happened after we initiated the purchase
          const txTime = (tx.status?.block_time ?? Date.now() / 1000) * 1000;
          const isRecent = txTime >= afterTimestamp;

          if (isFromSender && isRecent) {
            console.log("✅ Found TX via polling:", tx.txid);
            return tx.txid;
          }
        }
      } catch (e) {
        console.warn("Polling error:", e);
      }
    }

    return null;
  };

  const buyAccess = async (
    influencerId: string,
    tierIndex: number,
    priceInSatoshis: number,
  ): Promise<TransactionResult | null> => {
    if (!isConnected || !walletAddress) return null;
    setIsLoading(true);

    return new Promise((resolve) => {
      let settled = false;
      const initiatedAt = Date.now();

      const settle = (result: TransactionResult) => {
        if (settled) return;
        settled = true;
        setIsLoading(false);
        resolve(result);
      };

      const timeoutId = setTimeout(() => {
        settle({ success: false, error: "Timeout" });
      }, 60000);

      sendBtcTransaction({
        payload: {
          network: { type: BitcoinNetworkType.Regtest },
          recipients: [
            { address: YOUR_WALLET, amountSats: BigInt(priceInSatoshis) },
          ],
          senderAddress: walletAddress,
        },
        onFinish: (txId: string) => {
          // If Xverse ever fixes this and onFinish works, handle it normally
          clearTimeout(timeoutId);
          console.log("✅ onFinish fired (Xverse fixed?):", txId);

          const key = `privilege_proof_${walletAddress}_${influencerId}_${tierIndex}`;
          localStorage.setItem(key, JSON.stringify({ txId }));
          settle({ success: true, txHash: txId });
        },
        onCancel: () => {
          // DON'T resolve yet — Xverse fires this even on success
          // Instead, poll the mempool to check if TX actually went through
          console.log("⚠️ onCancel fired — polling mempool to verify...");

          pollForTx(walletAddress!, initiatedAt).then((txId) => {
            clearTimeout(timeoutId);

            if (txId) {
              console.log("✅ TX confirmed via polling:", txId);
              const key = `privilege_proof_${walletAddress}_${influencerId}_${tierIndex}`;
              localStorage.setItem(key, JSON.stringify({ txId }));
              settle({ success: true, txHash: txId });
            } else {
              console.log("❌ No TX found in mempool — genuine cancellation");
              settle({ success: false, error: "Cancelled" });
            }
          });
        },
      });
    });
  };

  const checkAccess = async (influencerId: string): Promise<boolean[]> => {
    if (!walletAddress) return [false, false, false];

    const results = [];
    for (let i = 0; i < 3; i++) {
      const key = `privilege_proof_${walletAddress}_${influencerId}_${i}`;
      results.push(!!localStorage.getItem(key));
    }
    return results;
  };

  return { buyAccess, checkAccess, isLoading };
};
