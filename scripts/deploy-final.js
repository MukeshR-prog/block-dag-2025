const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting CardSmart Deployment with Nonce Management...");
  console.log("=====================================");

  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  const balanceInBDAG = ethers.formatEther(balance);
  console.log("💰 Account balance:", balanceInBDAG, "BDAG");

  // Get current nonce
  const nonce = await ethers.provider.getTransactionCount(deployer.address);
  console.log("🔢 Current nonce:", nonce);

  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name, "| Chain ID:", network.chainId.toString());

  try {
    console.log("\n📦 Deploying CardSmart contract...");
    
    // Deploy contract with higher gas price to avoid replacement issues
    const CardSmart = await ethers.getContractFactory("CardSmart");
    
    const cardSmart = await CardSmart.deploy({
      gasLimit: 5000000,  // 5M gas limit
      gasPrice: ethers.parseUnits("50", "gwei"),  // Higher gas price (50 gwei)
      nonce: nonce  // Explicit nonce
    });

    console.log("⏳ Deployment transaction sent...");
    console.log("📄 Transaction hash:", cardSmart.deploymentTransaction()?.hash);

    // Wait for deployment with timeout
    console.log("⏳ Waiting for deployment confirmation...");
    const receipt = await cardSmart.deploymentTransaction()?.wait();
    console.log("✅ Transaction confirmed in block:", receipt?.blockNumber);

    const contractAddress = await cardSmart.getAddress();
    console.log("✅ CardSmart deployed successfully!");
    console.log("📍 Contract address:", contractAddress);

    // Verify deployment
    console.log("\n🔍 Verifying deployment...");
    const owner = await cardSmart.owner();
    console.log("👤 Contract owner:", owner);

    // Register deployer as user
    console.log("\n👤 Registering deployer as user...");
    const registerTx = await cardSmart.registerUser(deployer.address, {
      gasLimit: 200000,
      gasPrice: ethers.parseUnits("50", "gwei"),
      nonce: nonce + 1
    });
    
    console.log("⏳ Registration transaction hash:", registerTx.hash);
    await registerTx.wait();
    console.log("✅ User registered successfully!");

    // Final verification
    const isRegistered = await cardSmart.isUserRegistered(deployer.address);
    console.log("✅ User registration confirmed:", isRegistered);

    console.log("\n🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!");
    console.log("=====================================");
    console.log("📍 Contract Address:", contractAddress);
    console.log("👤 Owner Address:", owner);
    console.log("🔗 BlockDAG Explorer: https://primordial.bdagscan.com/address/" + contractAddress);
    
    console.log("\n📋 Update your .env file with:");
    console.log("CARDSMART_CONTRACT_ADDRESS=" + contractAddress);
    console.log("NEXT_PUBLIC_CARDSMART_CONTRACT_ADDRESS=" + contractAddress);

    return {
      contractAddress,
      owner,
      transactionHash: cardSmart.deploymentTransaction()?.hash,
      blockNumber: receipt?.blockNumber
    };

  } catch (error) {
    console.error("❌ Deployment failed:");
    console.error("Error:", error.message);
    console.error("Code:", error.code);
    
    if (error.message.includes("insufficient funds")) {
      console.log("💡 Solution: Get more BDAG tokens from https://primordial.bdagscan.com/faucet");
    } else if (error.message.includes("nonce")) {
      console.log("💡 Solution: Wait 1-2 minutes and try again");
    } else if (error.message.includes("underpriced")) {
      console.log("💡 Solution: Increased gas price to 50 gwei");
    }
    
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
