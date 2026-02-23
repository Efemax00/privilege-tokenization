
import type { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async (hre) => {
  console.log("🚀 Deploying Privilege Token to MIDL Regtest...");

  /**
   * Initializes the MIDL hardhat deploy SDK
   */
  await hre.midl.initialize();
  console.log("✅ MIDL initialized");

  /**
   * Add the deploy contract transaction intention
   */
  const ownerAddress = "0xeE3A198DfdFE7da8B7199D7d523355D6854888d4";
  console.log(`📍 Deploying with owner: ${ownerAddress}`);
  
  await hre.midl.deploy("PrivilegeToken", [ownerAddress]);
  console.log("✅ Deployment intention added");

  /**
   * Sends the BTC transaction and EVM transaction to the network
   */
  console.log("📝 Executing (sending BTC + EVM together)...");
  const result = await hre.midl.execute();
  
  console.log("✅ Deployment complete!");
  console.log("📋 Result:", result);
};

deploy.tags = ["main", "PrivilegeToken"];
export default deploy;
