const { ethers } = require("hardhat");

async function deployWithAutoGas() {
  console.log("🚀 Starting CardSmart Deployment with Auto Gas...");
  console.log("=====================================");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deployer:", deployer.address);

  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "BDAG");

  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network Chain ID:", network.chainId.toString());

  try {
    console.log("\n📦 Deploying CardSmart...");
    
    // Use the built-in Hardhat deployment
    const CardSmart = await ethers.getContractFactory("CardSmart");
    
    // Deploy with auto gas estimation
    const cardSmart = await CardSmart.deploy();
    console.log("⏳ Deployment transaction hash:", cardSmart.deploymentTransaction()?.hash);
    
    // Wait for deployment
    console.log("⏳ Waiting for confirmation...");
    const deployedContract = await cardSmart.waitForDeployment();
    
    const contractAddress = await deployedContract.getAddress();
    console.log("✅ Contract deployed to:", contractAddress);

    // Verify the contract works
    const owner = await deployedContract.owner();
    console.log("👤 Contract owner:", owner);

    console.log("\n🎉 DEPLOYMENT SUCCESSFUL!");
    console.log("📍 Contract Address:", contractAddress);
    console.log("🔗 Explorer: https://primordial.bdagscan.com/address/" + contractAddress);
    
    // Update environment variables
    console.log("\n📋 Add to .env file:");
    console.log("CARDSMART_CONTRACT_ADDRESS=" + contractAddress);
    console.log("NEXT_PUBLIC_CARDSMART_CONTRACT_ADDRESS=" + contractAddress);

    return contractAddress;

  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    
    // Specific error handling
    if (error.message.includes("insufficient funds")) {
      console.log("💡 Get more BDAG: https://primordial.bdagscan.com/faucet");
    } else if (error.message.includes("timeout")) {
      console.log("💡 Network congestion - try again in a few minutes");
    } else if (error.message.includes("nonce")) {
      console.log("💡 Nonce issue - wait 2 minutes and retry");
    }
    
    throw error;
  }
}

deployWithAutoGas().catch(console.error);
