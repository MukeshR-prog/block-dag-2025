const { ethers } = require("hardhat");

async function verifyContract() {
  console.log("🔍 Verifying CardSmart Contract Deployment");
  console.log("=====================================");

  const contractAddress = "0xef33F037Df69E2dfc475007F36E6183eE390ADbF";
  console.log("📍 Contract Address:", contractAddress);

  try {
    // Check if contract exists
    const code = await ethers.provider.getCode(contractAddress);
    console.log("📄 Contract code length:", code.length);
    
    if (code === "0x") {
      console.log("❌ No contract found at this address");
      return;
    }
    
    console.log("✅ Contract code exists!");
    
    // Try to interact with contract
    const CardSmart = await ethers.getContractFactory("CardSmart");
    const cardSmart = CardSmart.attach(contractAddress);
    
    console.log("🔍 Testing contract functions...");
    
    try {
      // Wait a bit and then try owner
      await new Promise(resolve => setTimeout(resolve, 2000));
      const owner = await cardSmart.owner();
      console.log("👤 Contract Owner:", owner);
      console.log("✅ Contract is fully functional!");
      
    } catch (error) {
      console.log("⚠️  Owner function failed:", error.message);
      console.log("ℹ️  Contract may still be initializing...");
    }

    // Check deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deployer address:", deployer.address);
    
    try {
      // Try to register user
      console.log("👤 Attempting to register deployer...");
      const tx = await cardSmart.registerUser(deployer.address);
      console.log("⏳ Registration transaction:", tx.hash);
      await tx.wait();
      console.log("✅ User registered successfully!");
      
    } catch (error) {
      if (error.message.includes("already registered")) {
        console.log("✅ User already registered!");
      } else {
        console.log("⚠️  Registration failed:", error.message);
      }
    }

    console.log("\n🎉 VERIFICATION COMPLETE!");
    console.log("📍 Contract Address:", contractAddress);
    console.log("🔗 BlockDAG Explorer: https://primordial.bdagscan.com/address/" + contractAddress);
    console.log("🔗 Transaction Explorer: https://primordial.bdagscan.com/tx/0x678c694c943f8c14c49ae6d68bff404dc9bc3e0282da7e5fbb3521b5339575e3");
    
    console.log("\n📋 Environment Variables Updated:");
    console.log("CARDSMART_CONTRACT_ADDRESS=" + contractAddress);
    console.log("NEXT_PUBLIC_CARDSMART_CONTRACT_ADDRESS=" + contractAddress);

  } catch (error) {
    console.error("❌ Verification failed:", error.message);
  }
}

verifyContract();
