import type { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async (hre) => {
  console.log("🚀 Deploying Privilege Token to MIDL Regtest...");

  try {
    /**
     * Initializes the MIDL hardhat deploy SDK
     */
    await hre.midl.initialize();
    console.log("✅ MIDL initialized");

    /**
     * Add the deploy contract transaction intention
     */
    const ownerAddress = "0x3f953B8e4A0Cf92be078c3034d4060CC77731358";
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
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    throw error;
  }
};

deploy.tags = ["main", "PrivilegeToken"];
export default deploy;