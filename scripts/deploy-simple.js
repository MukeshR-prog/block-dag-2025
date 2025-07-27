const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Simple CardSmart Deployment to BlockDAG Testnet");
  console.log("================================================");
  
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deployer:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "BDAG");
  
  if (parseFloat(ethers.formatEther(balance)) < 0.1) {
    console.error("❌ Insufficient balance! Need at least 0.1 BDAG");
    console.log("🔗 Get tokens: https://primordial.bdagscan.com/faucet");
    return;
  }
  
  const CardSmart = await ethers.getContractFactory("CardSmart");
  
  try {
    console.log("📦 Deploying CardSmart contract...");
    const cardSmart = await CardSmart.deploy();
    
    console.log("⏳ Transaction hash:", cardSmart.deploymentTransaction()?.hash);
    console.log("⏳ Waiting for confirmation...");
    
    await cardSmart.waitForDeployment();
    const address = await cardSmart.getAddress();
    
    console.log("✅ Contract deployed successfully!");
    console.log("📍 Contract Address:", address);
    console.log("🔗 Explorer: https://primordial.bdagscan.com/address/" + address);
    
    // Test contract
    try {
      const owner = await cardSmart.owner();
      console.log("👤 Contract Owner:", owner);
      console.log("✅ Contract is working!");
    } catch (error) {
      console.log("⚠️  Owner check failed (contract may still be initializing)");
    }
    
    console.log("\n🎉 DEPLOYMENT SUCCESSFUL!");
    console.log("================================================");
    console.log("📋 Add to your .env file:");
    console.log("CARDSMART_CONTRACT_ADDRESS=" + address);
    console.log("NEXT_PUBLIC_CARDSMART_CONTRACT_ADDRESS=" + address);
    
    return address;
    
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("💡 Get BDAG: https://primordial.bdagscan.com/faucet");
    } else if (error.message.includes("nonce")) {
      console.log("💡 Wait 2 minutes and try again");
    } else if (error.message.includes("timeout")) {
      console.log("💡 Network congestion - retry in 5 minutes");
    } else {
      console.log("💡 Try: npm run deploy:local (for local testing)");
    }
    
    throw error;
  }
}

main().then((address) => {
  if (address) {
    console.log("\n✅ SUCCESS! Contract deployed to:", address);
  }
}).catch((error) => {
  console.error("\n❌ Deployment failed:", error.message);
  process.exitCode = 1;
});
