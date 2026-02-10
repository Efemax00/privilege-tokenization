const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying BitcoinTestFaucet...");

  const contract = await hre.ethers.deployContract("BitcoinTestFaucet");
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ Contract deployed to:", address);
  console.log("\n📝 Save this address!");
  console.log("Add to frontend/.env.local:");
  console.log("NEXT_PUBLIC_CONTRACT_ADDRESS=" + address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});