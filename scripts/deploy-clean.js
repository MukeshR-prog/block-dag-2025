const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting Clean CardSmart Deployment to BlockDAG Testnet...");
  console.log("=====================================");

  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  const balanceInBDAG = ethers.formatEther(balance);
  console.log("💰 Account balance:", balanceInBDAG, "BDAG");

  if (parseFloat(balanceInBDAG) < 0.1) {
    console.error("❌ Insufficient balance for deployment. Need at least 0.1 BDAG");
    return;
  }

  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name, "| Chain ID:", network.chainId.toString());

  try {
    console.log("\n📦 Deploying CardSmart contract...");
    
    // Deploy contract
    const CardSmart = await ethers.getContractFactory("CardSmart");
    
    // Deploy with explicit gas settings
    const cardSmart = await CardSmart.deploy({
      gasLimit: 3000000,  // 3M gas limit
      gasPrice: ethers.parseUnits("20", "gwei")  // 20 gwei
    });

    console.log("⏳ Waiting for deployment transaction...");
    console.log("📄 Deployment transaction hash:", cardSmart.deploymentTransaction()?.hash);

    // Wait for deployment
    await cardSmart.waitForDeployment();
    
    const contractAddress = await cardSmart.getAddress();
    console.log("✅ CardSmart deployed successfully!");
    console.log("📍 Contract address:", contractAddress);

    // Verify deployment by calling a simple function
    console.log("\n🔍 Verifying deployment...");
    const owner = await cardSmart.owner();
    console.log("👤 Contract owner:", owner);

    // Register the deployer as a user
    console.log("\n👤 Registering deployer as user...");
    const registerTx = await cardSmart.registerUser(deployer.address, {
      gasLimit: 100000
    });
    console.log("⏳ Registration transaction hash:", registerTx.hash);
    await registerTx.wait();
    console.log("✅ User registered successfully!");

    console.log("\n🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!");
    console.log("=====================================");
    console.log("📍 Contract Address:", contractAddress);
    console.log("👤 Owner Address:", owner);
    console.log("🔗 Explorer URL: https://primordial.bdagscan.com/address/" + contractAddress);
    
    console.log("\n📋 Environment Variables:");
    console.log("CARDSMART_CONTRACT_ADDRESS=" + contractAddress);
    console.log("NEXT_PUBLIC_CARDSMART_CONTRACT_ADDRESS=" + contractAddress);

    return {
      contractAddress,
      owner,
      transactionHash: cardSmart.deploymentTransaction()?.hash
    };

  } catch (error) {
    console.error("❌ Deployment failed:");
    console.error("Error:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("💡 Solution: Get more BDAG tokens from https://primordial.bdagscan.com/faucet");
    } else if (error.message.includes("nonce")) {
      console.log("💡 Solution: Reset your MetaMask account or wait for network sync");
    } else if (error.message.includes("network")) {
      console.log("💡 Solution: Check internet connection and RPC endpoint");
    }
    
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
