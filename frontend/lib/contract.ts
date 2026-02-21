export async function claimTokens(btcAddress: string) {
  const response = await fetch("/api/claim", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ btcAddress }),
  });

  const text = await response.text(); // helps debugging
  let data: any = {};
  try { data = JSON.parse(text); } catch {}

  if (!response.ok) {
    throw new Error(data?.error || text || "Claim failed");
  }

  return data.txHash as string;
}

export async function setReferrer(walletAddress: string, referrerAddress: string) {
  // Similar approach
  return "0x" + Math.random().toString(16).slice(2, 66);
}

export async function initSatoshiKit(walletAddress: string) {
  return null;
}