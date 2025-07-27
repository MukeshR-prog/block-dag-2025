const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Verifying CardSmart deployment on BlockDAG testnet...");

  const contractAddress = "0xd9cE818B6Dfb714688964Bc3855687bAc565Ad66";
  const [deployer] = await ethers.getSigners();
  
  console.log("📝 Deployer address:", deployer.address);
  console.log("📍 Contract address:", contractAddress);

  // Get contract instance
  const CardSmart = await ethers.getContractFactory("CardSmart");
  const cardSmart = CardSmart.attach(contractAddress);

  try {
    // Check if contract is deployed
    const owner = await cardSmart.owner();
    console.log("✅ Contract is live! Owner:", owner);
    
    // Check user registration
    try {
      const isRegistered = await cardSmart.isUserRegistered(deployer.address);
      console.log("👤 Deployer registered:", isRegistered);
      
      if (!isRegistered) {
        console.log("🔄 Registering deployer...");
        const tx = await cardSmart.registerUser(deployer.address);
        await tx.wait();
        console.log("✅ Deployer registered successfully!");
      }
    } catch (error) {
      console.log("⚠️  Registration check failed:", error.message);
    }

    // Get basic stats
    try {
      const totalUsers = await cardSmart.getTotalUsers();
      console.log("👥 Total users:", totalUsers.toString());
    } catch (error) {
      console.log("ℹ️  Could not get total users");
    }

  } catch (error) {
    console.error("❌ Contract verification failed:", error.message);
    return;
  }

  console.log("\n🎉 DEPLOYMENT VERIFICATION COMPLETE!");
  console.log("🔗 View on Explorer: https://primordial.bdagscan.com/address/" + contractAddress);
  console.log("📄 Contract ready for use!");
  
  console.log("\n📋 Environment Configuration:");
  console.log("CARDSMART_CONTRACT_ADDRESS=" + contractAddress);
  console.log("NEXT_PUBLIC_CARDSMART_CONTRACT_ADDRESS=" + contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
